/* eslint-disable vue/no-reserved-component-names */
/* eslint-disable vue/multi-word-component-names */
import './assets/main.css'
import 'primevue/resources/themes/aura-dark-noir/theme.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'
import { ru } from 'yup-locales'
import { setLocale as YupSetLocale } from 'yup'
import { i18n as dateformatI18N } from 'dateformat'

import PrimeVue from 'primevue/config'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import Menu from 'primevue/menu'
import Button from 'primevue/button'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import ScrollPanel from 'primevue/scrollpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import Row from 'primevue/row'
import FileUpload from 'primevue/fileupload'
import Message from 'primevue/message'
import Dialog from 'primevue/dialog'
import AutoComplete from 'primevue/autocomplete'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'
import ConfirmDialog from 'primevue/confirmdialog'
import ProgressSpinner from 'primevue/progressspinner'
import PickList from 'primevue/picklist'
import SelectButton from 'primevue/selectbutton'
import Image from 'primevue/image'
import Tag from 'primevue/tag'
import MultiSelect from 'primevue/multiselect'
import ProgressBar from 'primevue/progressbar'
import ContextMenu from 'primevue/contextmenu'
import Toolbar from 'primevue/toolbar'
import Chart from 'primevue/chart'
import Calendar from 'primevue/calendar'
import Paginator from 'primevue/paginator'

import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'

import { Chart as ChartJS } from 'chart.js'

ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.1)'
ChartJS.defaults.color = 'rgba(255, 255, 255, 0.5)'

import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'

YupSetLocale(ru)

const app = createApp(App)

app.use(PrimeVue, {
    locale: {
        startsWith: 'Начинается с',
        contains: 'Содержит',
        notContains: 'Не содержит',
        endsWith: 'Заканчивается',
        equals: 'Равно',
        notEquals: 'Не равно',
        noFilter: 'Нет фильтра',
        filter: 'Фильтр',
        lt: 'Меньше чем',
        lte: 'Меньше чем или равно',
        gt: 'Более чем',
        gte: 'Более чем или равно',
        dateIs: 'Дата равна',
        dateIsNot: 'Дата не равна',
        dateBefore: 'Дата до',
        dateAfter: 'Дата после',
        custom: 'Пользовательский',
        clear: 'Очистить',
        apply: 'Принять',
        matchAll: 'Сопоставить все',
        matchAny: 'Совпадение с любым',
        addRule: 'Добавить правило',
        removeRule: 'Удалить правило',
        accept: 'Да',
        reject: 'Нет',
        choose: 'Выбрать',
        upload: 'Загрузить',
        cancel: 'Отмена',
        completed: 'Завершено',
        pending: 'В ожидании',
        fileSizeTypes: ['Б', 'Кб', 'Мб', 'Гб', 'Тб', 'Пб', 'Эб', 'Зб', 'Йб'],
        dayNames: [
            'Воскресенье',
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота'
        ],
        dayNamesShort: ['Вск', 'Пнд', 'Втр', 'Срд', 'Чтв', 'Птн', 'Сбт'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        monthNames: [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь'
        ],
        monthNamesShort: [
            'Янв',
            'Фев',
            'Мар',
            'Апр',
            'Май',
            'Июн',
            'Июл',
            'Авг',
            'Сен',
            'Окт',
            'Ноя',
            'Дек'
        ],
        chooseYear: 'Выбрать год',
        chooseMonth: 'Выбрать месяц',
        chooseDate: 'Выбрать дату',
        prevDecade: 'Предыдущее десятилетие',
        nextDecade: 'Следующее десятилетие',
        prevYear: 'Предыдущий год',
        nextYear: 'Следующий год',
        prevMonth: 'Предыдущий месяц',
        nextMonth: 'Следующий месяц',
        prevHour: 'Предыдущий час',
        nextHour: 'Следующий час',
        prevMinute: 'Предыдущая минута',
        nextMinute: 'Следующая минута',
        prevSecond: 'Предыдущая секунда',
        nextSecond: 'Следующая секунда',
        am: 'до полудня',
        pm: 'после полудня',
        today: 'Сегодня',
        weekHeader: 'Нед.',
        firstDayOfWeek: 1,
        showMonthAfterYear: false,
        dateFormat: 'dd.mm.yy',
        weak: 'Простой',
        medium: 'Нормальный',
        strong: 'Хороший',
        passwordPrompt: 'Введите пароль',
        emptyFilterMessage: 'Результатов не найдено',
        searchMessage: '{0} результатов доступно',
        selectionMessage: '{0} элементов выбрано',
        emptySelectionMessage: 'Нет выбранного элемента',
        emptySearchMessage: 'Результатов не найдено',
        emptyMessage: 'Нет доступных вариантов',
        aria: {
            trueLabel: 'Верно',
            falseLabel: 'Неверно',
            nullLabel: 'Не выбран',
            star: '1 звезда',
            stars: '{star} звёзд',
            selectAll: 'Выбраны все элементы',
            unselectAll: 'Все элементы не выбраны',
            close: 'Закрыть',
            previous: 'Предыдущий',
            next: 'Следующий',
            navigation: 'Навигация',
            scrollTop: 'Прокрутить в начало',
            moveTop: 'Переместить в начало',
            moveUp: 'Переместить вверх',
            moveDown: 'Переместить вниз',
            moveBottom: 'Переместить в конец',
            moveToTarget: 'Переместить в приёмник',
            moveToSource: 'Переместить в источник',
            moveAllToTarget: 'Переместить всё в приёмник',
            moveAllToSource: 'Переместить всё в источник',
            pageLabel: '{page}',
            firstPageLabel: 'Первая страница',
            lastPageLabel: 'Последняя страница',
            nextPageLabel: 'Следующая страница',
            previousPageLabel: 'Предыдущая страница',
            rowsPerPageLabel: 'Строк на странице',
            jumpToPageDropdownLabel: 'Перейти к раскрывающемуся списку страниц',
            jumpToPageInputLabel: 'Перейти к вводу страницы',
            selectRow: 'Выбрана строка',
            unselectRow: 'Строка не выбрана',
            expandRow: 'Строка развёрнута',
            collapseRow: 'Строка свёрнута',
            showFilterMenu: 'Показать меню фильтра',
            hideFilterMenu: 'Скрыть меню фильтра',
            filterOperator: 'Оператор фильтра',
            filterConstraint: 'Ограничение фильтра',
            editRow: 'Редактирование строки',
            saveEdit: 'Сохранить правку',
            cancelEdit: 'Отменить правку',
            listView: 'В виде списка',
            gridView: 'В виде сетки',
            slide: 'Слайд',
            slideNumber: '{slideNumber}',
            zoomImage: 'Увеличить изображение',
            zoomIn: 'Увеличить',
            zoomOut: 'Уменьшить',
            rotateRight: 'Повернуть вправо',
            rotateLeft: 'Повернуть влево'
        }
    }
})

dateformatI18N.dayNames = [
    'Вс',
    'Пн',
    'Вт',
    'Ср',
    'Чт',
    'Пт',
    'Сб',
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
]

dateformatI18N.monthNames = [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июн',
    'Июл',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
]

dateformatI18N.timeNames = ['a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM']

app.use(ToastService)
app.use(ConfirmationService)
app.use(DialogService)
app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, {
    queryClientConfig: {
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000
            }
        }
    }
} as VueQueryPluginOptions)

app.component('InputNumber', InputNumber)
app.component('InputMask', InputMask)
app.component('Splitter', Splitter)
app.component('SplitterPanel', SplitterPanel)
app.component('InputText', InputText)
app.component('InputSwitch', InputSwitch)
app.component('Button', Button)
app.component('Menu', Menu)
app.component('Accordion', Accordion)
app.component('AccordionTab', AccordionTab)
app.component('ScrollPanel', ScrollPanel)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('ColumnGroup', ColumnGroup)
app.component('Row', Row)
app.component('FileUpload', FileUpload)
app.component('Message', Message)
app.component('Dialog', Dialog)
app.component('AutoComplete', AutoComplete)
app.component('Dropdown', Dropdown)
app.component('Checkbox', Checkbox)
app.component('ConfirmDialog', ConfirmDialog)
app.component('ProgressSpinner', ProgressSpinner)
app.component('PickList', PickList)
app.component('SelectButton', SelectButton)
app.component('Image', Image)
app.component('Tag', Tag)
app.component('MultiSelect', MultiSelect)
app.component('ProgressBar', ProgressBar)
app.component('ContextMenu', ContextMenu)
app.component('Toolbar', Toolbar)
app.component('Chart', Chart)
app.component('Calendar', Calendar)
app.component('Paginator', Paginator)

app.mount('#app')
