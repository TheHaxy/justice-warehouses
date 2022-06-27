# <div align="center">JUSTICE WAREHOUSES</div>

Используемые технологии:

[<img alt="NextJS" src="https://img.shields.io/badge/-Next-090909?style=for-the-badge&logo=Next.js" alt="NextJS"/>](https://nextjs.org/)
[<img alt="Effector" src="https://img.shields.io/badge/-Effector-090909?style=for-the-badge&logo=Effector" alt="Effector"/>](https://effector.dev/ru/)
[<img alt="Tailwind" src="https://img.shields.io/badge/-Tailwind-090909?style=for-the-badge&logo=TailwindCSS" alt="TailwindCSS"/>](https://tailwindcss.com/)

Принцип работы web-приложения:

При первом входе мы видим две пустые страницы (склады и продукты):
![img.png](assets/images/img.png)

Нам необходимо создать первый склад или продукт:
![img_1.png](assets/images/img_1.png)

Теперь, когда склад существует, при создании продукта мы можем сразу распределить его на этот склад:
![img_2.png](assets/images/img_2.png)

Аналогичная ситуация и со складами, если в хранилище есть продукты, то при создании склада мы можем сразу распределить на него продукцию:
![img_3.png](assets/images/img_3.png)

На странице склада мы можем расределять на него продукцию из нераспределенных запасов:
![img_4.png](assets/images/img_4.png)

При удалении продукции со склада она возвращается в нераспределенные запасы:
![img_5.png](assets/images/img_5.png)

Также есть возможность перемещать продукцию со склада на склад:
![img_6.png](assets/images/img_6.png)

И распределять продукт по складам со страницы продукта:
![img_7.png](assets/images/img_7.png)