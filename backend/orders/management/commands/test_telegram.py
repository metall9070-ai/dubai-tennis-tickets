"""
Management command to test Telegram bot integration.
Also helps retrieve chat_id for initial setup.
"""

import httpx
from django.core.management.base import BaseCommand
from django.conf import settings


class Command(BaseCommand):
    help = 'Test Telegram bot and get chat_id'

    def add_arguments(self, parser):
        parser.add_argument(
            '--get-chat-id',
            action='store_true',
            help='Get updates to find your chat_id'
        )
        parser.add_argument(
            '--test',
            action='store_true',
            help='Send a test message'
        )

    def handle(self, *args, **options):
        token = settings.TELEGRAM_BOT_TOKEN

        if not token:
            self.stderr.write(self.style.ERROR(
                'TELEGRAM_BOT_TOKEN not set in environment variables!'
            ))
            return

        if options['get_chat_id']:
            self.get_chat_id(token)
        elif options['test']:
            self.send_test_message()
        else:
            self.stdout.write('Use --get-chat-id or --test')

    def get_chat_id(self, token):
        """Fetch updates to find chat_id."""
        url = f"https://api.telegram.org/bot{token}/getUpdates"

        self.stdout.write(f'\nFetching updates from Telegram...\n')

        try:
            with httpx.Client(timeout=10.0) as client:
                response = client.get(url)
                data = response.json()

                if not data.get('ok'):
                    self.stderr.write(self.style.ERROR(
                        f'Error: {data.get("description", "Unknown error")}'
                    ))
                    return

                results = data.get('result', [])

                if not results:
                    self.stdout.write(self.style.WARNING(
                        '\nNo messages found!'
                        '\n\n1. Open your bot in Telegram'
                        '\n2. Send /start to the bot'
                        '\n3. Run this command again'
                    ))
                    return

                self.stdout.write(self.style.SUCCESS('\nFound chat(s):'))
                seen_chats = set()

                for update in results:
                    message = update.get('message', {})
                    chat = message.get('chat', {})
                    chat_id = chat.get('id')

                    if chat_id and chat_id not in seen_chats:
                        seen_chats.add(chat_id)
                        chat_type = chat.get('type', 'unknown')
                        name = chat.get('first_name', '') or chat.get('title', '')

                        self.stdout.write(
                            f'\n  Chat ID: {self.style.SUCCESS(str(chat_id))}'
                            f'\n  Name: {name}'
                            f'\n  Type: {chat_type}'
                        )

                self.stdout.write(
                    f'\n\nAdd this to your .env file:'
                    f'\nTELEGRAM_CHAT_ID={list(seen_chats)[0] if seen_chats else "YOUR_CHAT_ID"}'
                )

        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error: {e}'))

    def send_test_message(self):
        """Send a test notification."""
        from orders.notifications import telegram_notifier

        if not telegram_notifier.is_configured():
            self.stderr.write(self.style.ERROR(
                'Telegram not configured! Set these environment variables:'
                '\n  - TELEGRAM_BOT_TOKEN'
                '\n  - TELEGRAM_CHAT_ID'
                '\n  - TELEGRAM_NOTIFICATIONS_ENABLED=True'
            ))
            return

        self.stdout.write('Sending test message...')

        message = """
🧪 <b>ТЕСТОВОЕ СООБЩЕНИЕ</b>

✅ Telegram бот настроен правильно!

Теперь вы будете получать уведомления о новых заказах.
"""

        success = telegram_notifier.send_message(message.strip())

        if success:
            self.stdout.write(self.style.SUCCESS(
                '\n✅ Test message sent successfully!'
                '\nCheck your Telegram!'
            ))
        else:
            self.stderr.write(self.style.ERROR(
                '\n❌ Failed to send test message.'
                '\nCheck your bot token and chat_id.'
            ))
