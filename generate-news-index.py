#!/usr/bin/env python3
"""
Генератор индекса новостей для сайта Марии Радзивил.
Запускайте после добавления файлов в папку news/

Использование:
    python3 generate-news-index.py

Сканирует папку news/ и создает news-index.json
"""

import os
import json
from datetime import datetime

NEWS_DIR = "news"
OUTPUT_FILE = "news-index.json"

def get_file_type(filename):
    ext = os.path.splitext(filename)[1].lower()
    if ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']:
        return 'image'
    elif ext in ['.mp4', '.webm', '.ogg', '.mov']:
        return 'video'
    elif ext in ['.md', '.txt', '.html']:
        return 'article'
    else:
        return 'other'

def extract_title(filename):
    # Убираем расширение и заменяем _ и - на пробелы
    name = os.path.splitext(filename)[0]
    title = name.replace('_', ' ').replace('-', ' ').strip()
    return title.title()

def main():
    if not os.path.exists(NEWS_DIR):
        print(f"Папка {NEWS_DIR}/ не найдена. Создаю...")
        os.makedirs(NEWS_DIR)
        return

    news_items = []

    for filename in sorted(os.listdir(NEWS_DIR)):
        filepath = os.path.join(NEWS_DIR, filename)
        if os.path.isfile(filepath):
            file_type = get_file_type(filename)
            if file_type == 'other':
                continue

            stat = os.stat(filepath)

            item = {
                "id": len(news_items) + 1,
                "filename": filename,
                "title": extract_title(filename),
                "type": file_type,
                "src": f"{NEWS_DIR}/{filename}",
                "date": datetime.fromtimestamp(stat.st_mtime).strftime("%d.%m.%Y"),
                "description": ""
            }
            news_items.append(item)

    # Сортируем по дате изменения (новые сверху)
    news_items.sort(key=lambda x: x["date"], reverse=True)

    # Перенумеруем после сортировки
    for i, item in enumerate(news_items, 1):
        item["id"] = i

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(news_items, f, ensure_ascii=False, indent=2)

    print(f"✅ Создан {OUTPUT_FILE} с {len(news_items)} элементами")
    print(f"   Изображений: {sum(1 for x in news_items if x['type'] == 'image')}")
    print(f"   Видео: {sum(1 for x in news_items if x['type'] == 'video')}")
    print(f"   Статей: {sum(1 for x in news_items if x['type'] == 'article')}")

if __name__ == "__main__":
    main()
