import os
from django.conf import settings
from api.models import (
    Category,
    Type,
    Series,
    ProductField,
    Stock,
    Module,
    Article)

def create_sample_data():
    # Создание статьи
    Article.objects.create(
        title='Как выбрать подходящий тип продукции для вашего проекта',
        content='''
При выборе продукции для вашего проекта важно учитывать несколько 
ключевых факторов. <br /><br /><b>Во-первых,</b> определите 
категорию продукции, которая соответствует вашим потребностям. 
Например, если вы работаете над строительным проектом, 
вам могут понадобиться материалы для отделки или конструкции.
<br /><br /><b>Во-вторых,</b> изучите доступные типы продукции в 
выбранной категории. Каждый тип имеет свои особенности и 
характеристики, которые могут повлиять на конечный результат. 
Например, если вы выбираете окна, обратите внимание на их 
теплоизоляцию, материал рамы и возможность кастомизации.<br />
<br /><b>Наконец,</b> выберите серию продукции, которая лучше 
всего соответствует вашему бюджету и требованиям. Убедитесь, что 
вы учли все важные параметры, такие как размеры, цвет и 
дополнительные функции. <br /><br />Следуя этим шагам,</b> 
вы сможете сделать осознанный выбор и обеспечить высокое 
качество вашего проекта.
        ''',
        is_published=True
    )

    # Создание категорий
    neutral = Category.objects.create(name="Нейтральное")
    thermal = Category.objects.create(name="Непловое")

    # Создание типов
    umbrella = Type.objects.create(category=neutral, name="Зонты")
    shelves = Type.objects.create(category=neutral, name="Стеллажи")

    # Создание серий
    zvn_01 = Series.objects.create(type=umbrella, name="ЗВН-01")
    zvn_02 = Series.objects.create(type=umbrella, name="ЗВН-02")

    # Создание полей для расчета
    ProductField.objects.create(
                                series=zvn_01, field_name="Ширина",
                                field_type="number")
    ProductField.objects.create(
                                series=zvn_01, field_name="Глубина",
                                field_type="number")
    ProductField.objects.create(
                                series=zvn_01, field_name="Высота",
                                field_type="number")
    ProductField.objects.create(
                                series=zvn_01,
                                field_name="Крашенный",
                                field_type="boolean",
                                options=["крашенный", "Не крашенный"],
                                custom_true='краш',
                                custom_false='некраш')   
    ProductField.objects.create(
                                series=zvn_01,
                                field_name="Форма",
                                field_type="select",
                                options=["круг", "шар"])   

    # Создание остатков на складе
    Stock.objects.create(name="ЗВН-1 1200х700х400", price=10000, quantity=5)
    Stock.objects.create(name="Ванна красивая", price=1200, quantity=3)

    # Создание модуля расчета
    module_path = "modules.calculate_zvn_01"
    Module.objects.create(series=zvn_01, module_path=module_path)

    # Генерация файла модуля расчета
    modules_dir = os.path.join(settings.BASE_DIR, 'modules')
    os.makedirs(modules_dir, exist_ok=True)  # Создаем директорию, если она не существует

    file_path = os.path.join(modules_dir, 'calculate_zvn_01.py')
    with open(file_path, 'w') as f:
        f.write('''
def calculate_cost(data):
    data = data.split('/')
    cost = int(data[0]) * int(data[1]) * int(data[2]) * 1000 / 1000000000
    return cost
''')

    print(f"Файл {file_path} успешно создан.")
