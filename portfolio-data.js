// 📦 КАК ДОБАВИТЬ НОВУЮ РАБОТУ:
// 1. Положите изображение в папку /images
// 2. Скопируйте объект ниже и вставьте в конец массива
// 3. Заполните поля:
//    - id: уникальный номер
//    - title: название картины
//    - year: год создания
//    - type: "painting" (для Живописи) или "graphics" (для Графики)
//    - category: выберите один из вариантов ниже:
//      Для painting: "cityscape", "portrait", "mythopoetics", "still-life", "genre", "animals"
//      Для graphics: "pastel_charcoal", "watercolor", "ink_liner"
//    - image: путь к файлу
//    - description: техника, размер, комментарий
// 4. Сохраните. Галерея обновится автоматически.

const portfolioData = [
  { id: 1, title: "Утренний Петербург", year: 2024, type: "painting", category: "cityscape", image: "images/work1.jpg", description: "Масло, холст. 50x70 см." },
  { id: 2, title: "Взгляд сквозь время", year: 2023, type: "painting", category: "portrait", image: "images/work2.jpg", description: "Масло, холст. 60x80 см." },
  { id: 3, title: "Сказ о лебеде", year: 2024, type: "painting", category: "mythopoetics", image: "images/work3.jpg", description: "Масло, холст. 90x120 см." },
  { id: 4, title: "Натюрморт с гранатом", year: 2022, type: "painting", category: "still-life", image: "images/work4.jpg", description: "Масло, холст. 40x50 см." },
  { id: 5, title: "Осенний парк", year: 2023, type: "painting", category: "cityscape", image: "images/work5.jpg", description: "Масло, холст. 70x90 см." },
  { id: 6, title: "Девушка у окна", year: 2024, type: "painting", category: "portrait", image: "images/work6.jpg", description: "Масло, холст. 55x75 см." },
  { id: 7, title: "Вечерний город", year: 2023, type: "painting", category: "cityscape", image: "images/work7.jpg", description: "Масло, холст. 65x85 см." },
  { id: 8, title: "Портрет матери", year: 2022, type: "painting", category: "portrait", image: "images/work8.jpg", description: "Масло, холст. 70x90 см." },
  { id: 9, title: "Яблоки и вино", year: 2024, type: "painting", category: "still-life", image: "images/work9.jpg", description: "Масло, холст. 45x60 см." },
  { id: 10, title: "Древняя Русь", year: 2023, type: "painting", category: "mythopoetics", image: "images/work10.jpg", description: "Масло, холст. 100x130 см." },
  { id: 11, title: "Весенний дождь", year: 2024, type: "painting", category: "cityscape", image: "images/work11.jpg", description: "Масло, холст. 55x75 см." },
  { id: 12, title: "Бабушкин сад", year: 2022, type: "painting", category: "still-life", image: "images/work12.jpg", description: "Масло, холст. 50x65 см." },
  { id: 13, title: "Набросок с натуры", year: 2023, type: "graphics", category: "pastel_charcoal", image: "images/graphics1.jpg", description: "Пастель, уголь. 40x60 см." },
  { id: 14, title: "Дождь в городе", year: 2022, type: "graphics", category: "watercolor", image: "images/graphics2.jpg", description: "Акварель. 30x45 см." },
  { id: 15, title: "Архитектурная зарисовка", year: 2024, type: "graphics", category: "ink_liner", image: "images/graphics3.jpg", description: "Тушь, линер. 29x42 см." }
];