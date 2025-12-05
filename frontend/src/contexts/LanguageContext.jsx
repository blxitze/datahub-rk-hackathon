import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const translations = {
  ru: {
    // Navigation
    nav: {
      home: 'Главная',
      universities: 'Университеты',
      compare: 'Сравнение',
      favorites: 'Избранное',
    },
    // Home page
    home: {
      badge: 'Ваш гид по университетам Казахстана',
      title1: 'Найдите идеальный',
      title2: 'университет',
      title3: 'в Казахстане',
      subtitle: 'Ваша цифровая платформа для поиска и сравнения университетов. Примите осознанное решение о вашем будущем образовании.',
      cta: 'Выбрать университет',
      compareCta: 'Сравнить',
      stats: {
        universities: 'Университетов',
        students: 'Студентов',
        programs: 'Программ',
        cities: 'Городов',
      },
      features: {
        title: 'Всё для правильного выбора',
        subtitle: 'Наша платформа предоставляет все инструменты для принятия верного решения.',
        explore: {
          title: 'Исследуйте университеты',
          desc: 'Просматривайте подробные профили лучших университетов Казахстана.',
        },
        compare: {
          title: 'Сравнивайте',
          desc: 'Сравните до 3 университетов по стоимости, программам и условиям.',
        },
        favorites: {
          title: 'Сохраняйте избранное',
          desc: 'Создайте личный список понравившихся университетов.',
        },
        tours: {
          title: 'Виртуальные туры',
          desc: 'Познакомьтесь с кампусами через 3D виртуальные туры.',
        },
      },
      popular: {
        title: 'Популярные университеты',
        subtitle: 'Откройте для себя лучшие университеты Казахстана',
        viewAll: 'Смотреть все',
      },
      ctaSection: {
        title: 'Готовы начать свой путь?',
        subtitle: 'Изучите нашу базу данных университетов и найдите идеальный вариант для ваших академических целей.',
        button: 'Начать поиск',
      },
    },
    // Universities page
    universities: {
      title: 'Каталог университетов',
      subtitle: 'Откройте для себя {count} университетов Казахстана',
      filters: 'Фильтры',
      reset: 'Сбросить',
      search: 'Поиск университета...',
      city: 'Город',
      allCities: 'Все города',
      tuition: 'Стоимость обучения',
      studyForm: 'Форма обучения',
      programs: 'Программы',
      dormitory: 'Общежитие',
      hasDormitory: 'Есть общежитие',
      showing: 'Показано',
      of: 'из',
      universitiesWord: 'университетов',
      searchLabel: 'Поиск',
      cityLabel: 'Город',
      withDormitory: 'С общежитием',
      resetAll: 'Сбросить все',
      notFound: 'Университеты не найдены',
      notFoundDesc: 'Попробуйте изменить параметры фильтрации.',
      resetFilters: 'Сбросить фильтры',
      tuitionRanges: {
        any: 'Любая стоимость',
        free: 'Бесплатно (грант)',
        low: 'До 1 млн ₸',
        medium: '1 - 2 млн ₸',
        high: 'Более 2 млн ₸',
      },
      studyForms: {
        all: 'Все формы',
        fullTime: 'Очное',
        partTime: 'Заочное',
        both: 'Очное и заочное',
      },
    },
    // University card
    card: {
      free: 'Бесплатно',
      perYear: '/год',
      programs: 'прог.',
      hasDormitory: 'Общежитие',
      noDormitory: 'Без общежития',
      fullTime: 'Очное',
      partTime: 'Заочное',
      both: 'Очно/Заочно',
      details: 'Подробнее',
      addFavorite: 'Добавить в избранное',
      removeFavorite: 'Удалить из избранного',
      addCompare: 'Добавить к сравнению',
      removeCompare: 'Удалить из сравнения',
    },
    // University details
    details: {
      backToCatalog: 'Назад к каталогу',
      virtualTour: 'Виртуальный тур по кампусу',
      tourDesc: 'Исследуйте кампус виртуально. Используйте мышь для навигации.',
      gallery: 'Галерея кампуса',
      programsOffered: 'Программы обучения',
      quickInfo: 'Основная информация',
      tuitionFee: 'Стоимость',
      studyForm: 'Форма обучения',
      dormitory: 'Общежитие',
      founded: 'Год основания',
      students: 'Студентов',
      hasIt: 'Есть',
      noIt: 'Нет',
      contacts: 'Контакты',
      phone: 'Телефон',
      email: 'Email',
      website: 'Сайт',
      interested: 'Заинтересованы?',
      interestedDesc: 'Сравните этот университет с другими для принятия взвешенного решения.',
      goToCompare: 'Перейти к сравнению',
      notFound: 'Университет не найден',
      notFoundDesc: 'Запрашиваемый университет не существует.',
    },
    // Compare page
    compare: {
      title: 'Сравнение университетов',
      emptyDesc: 'Добавьте университеты для сравнения их характеристик',
      comparing: 'Сравнение {count}',
      universityWord: 'университета',
      universitiesWord: 'университетов',
      clear: 'Очистить',
      add: 'Добавить',
      slots: 'Слоты для сравнения',
      tip: 'Подсказка',
      tipText: 'Вы можете сравнить до 3 университетов одновременно. Добавьте больше университетов из',
      catalog: 'каталога',
      forMore: 'для более полного сравнения.',
      characteristics: 'Характеристики',
      city: 'Город',
      tuition: 'Стоимость обучения',
      rating: 'Рейтинг',
      studyForm: 'Форма обучения',
      dormitory: 'Общежитие',
      programs: 'Программы',
      founded: 'Год основания',
      students: 'Студентов',
      contacts: 'Контакты',
      hasIt: 'Есть',
      noIt: 'Нет',
      noData: 'Нет данных',
      na: 'Н/Д',
      noUniversities: 'Нет университетов для сравнения',
      noUniversitiesDesc: 'Добавьте университеты в список сравнения, чтобы увидеть их характеристики рядом.',
      goToCatalog: 'Перейти к каталогу',
      removeFromCompare: 'Удалить из сравнения',
    },
    // Favorites page
    favorites: {
      title: 'Мои избранные',
      emptyDesc: 'Здесь будут отображаться избранные университеты',
      saved: 'Сохранено {count}',
      universityWord: 'университет',
      universitiesWord: 'университетов',
      clearAll: 'Очистить всё',
      empty: 'Пока нет избранных',
      emptyText: 'Начните изучать университеты и добавляйте понравившиеся в избранное.',
      goToCatalog: 'Перейти к каталогу',
      tip: 'Полезно знать',
      tipText: 'Ваши избранные сохраняются локально на этом устройстве. Вы можете получить к ним доступ в любое время, даже без интернета. Чтобы сравнить избранные университеты, нажмите на иконку сравнения на карточке университета.',
    },
    // Footer
    footer: {
      description: 'Ваша цифровая платформа для поиска и сравнения университетов Казахстана. Найдите идеальный университет для вашего будущего образования.',
      navigation: 'Навигация',
      contacts: 'Контакты',
      location: 'Астана, Казахстан',
      rights: 'Все права защищены.',
    },
    // Common
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
    },
  },
  kk: {
    // Navigation
    nav: {
      home: 'Басты бет',
      universities: 'Университеттер',
      compare: 'Салыстыру',
      favorites: 'Таңдаулылар',
    },
    // Home page
    home: {
      badge: 'Қазақстан университеттері бойынша гид',
      title1: 'Қазақстандағы тамаша',
      title2: 'университетті',
      title3: 'табыңыз',
      subtitle: 'Университеттерді іздеу және салыстыру үшін сандық платформа. Болашақ білім алу туралы саналы шешім қабылдаңыз.',
      cta: 'Университет таңдау',
      compareCta: 'Салыстыру',
      stats: {
        universities: 'Университет',
        students: 'Студент',
        programs: 'Бағдарлама',
        cities: 'Қала',
      },
      features: {
        title: 'Дұрыс таңдау үшін барлығы',
        subtitle: 'Біздің платформа дұрыс шешім қабылдау үшін барлық құралдарды ұсынады.',
        explore: {
          title: 'Университеттерді зерттеңіз',
          desc: 'Қазақстанның үздік университеттерінің толық профильдерін қараңыз.',
        },
        compare: {
          title: 'Салыстырыңыз',
          desc: '3 университетті құны, бағдарламалары және жағдайлары бойынша салыстырыңыз.',
        },
        favorites: {
          title: 'Таңдаулыларға сақтаңыз',
          desc: 'Ұнаған университеттердің жеке тізімін жасаңыз.',
        },
        tours: {
          title: 'Виртуалды турлар',
          desc: '3D виртуалды турлар арқылы кампустармен танысыңыз.',
        },
      },
      popular: {
        title: 'Танымал университеттер',
        subtitle: 'Қазақстанның үздік университеттерін ашыңыз',
        viewAll: 'Барлығын көру',
      },
      ctaSection: {
        title: 'Жолыңызды бастауға дайынсыз ба?',
        subtitle: 'Біздің университеттер базасын зерттеп, академиялық мақсаттарыңызға сай тамаша нұсқаны табыңыз.',
        button: 'Іздеуді бастау',
      },
    },
    // Universities page
    universities: {
      title: 'Университеттер каталогы',
      subtitle: 'Қазақстанның {count} университетін ашыңыз',
      filters: 'Сүзгілер',
      reset: 'Тазалау',
      search: 'Университет іздеу...',
      city: 'Қала',
      allCities: 'Барлық қалалар',
      tuition: 'Оқу құны',
      studyForm: 'Оқу түрі',
      programs: 'Бағдарламалар',
      dormitory: 'Жатақхана',
      hasDormitory: 'Жатақхана бар',
      showing: 'Көрсетілген',
      of: '/',
      universitiesWord: 'университет',
      searchLabel: 'Іздеу',
      cityLabel: 'Қала',
      withDormitory: 'Жатақхана бар',
      resetAll: 'Барлығын тазалау',
      notFound: 'Университеттер табылмады',
      notFoundDesc: 'Сүзгі параметрлерін өзгертіп көріңіз.',
      resetFilters: 'Сүзгілерді тазалау',
      tuitionRanges: {
        any: 'Кез келген құны',
        free: 'Тегін (грант)',
        low: '1 млн ₸ дейін',
        medium: '1 - 2 млн ₸',
        high: '2 млн ₸ жоғары',
      },
      studyForms: {
        all: 'Барлық түрлері',
        fullTime: 'Күндізгі',
        partTime: 'Сырттай',
        both: 'Күндізгі және сырттай',
      },
    },
    // University card
    card: {
      free: 'Тегін',
      perYear: '/жыл',
      programs: 'бағд.',
      hasDormitory: 'Жатақхана бар',
      noDormitory: 'Жатақхана жоқ',
      fullTime: 'Күндізгі',
      partTime: 'Сырттай',
      both: 'Күндізгі/Сырттай',
      details: 'Толығырақ',
      addFavorite: 'Таңдаулыларға қосу',
      removeFavorite: 'Таңдаулылардан алып тастау',
      addCompare: 'Салыстыруға қосу',
      removeCompare: 'Салыстырудан алып тастау',
    },
    // University details
    details: {
      backToCatalog: 'Каталогқа қайту',
      virtualTour: 'Кампус бойынша виртуалды тур',
      tourDesc: 'Кампусты виртуалды түрде зерттеңіз. Навигация үшін тышқанды пайдаланыңыз.',
      gallery: 'Кампус галереясы',
      programsOffered: 'Оқу бағдарламалары',
      quickInfo: 'Негізгі ақпарат',
      tuitionFee: 'Құны',
      studyForm: 'Оқу түрі',
      dormitory: 'Жатақхана',
      founded: 'Құрылған жылы',
      students: 'Студенттер',
      hasIt: 'Бар',
      noIt: 'Жоқ',
      contacts: 'Байланыс',
      phone: 'Телефон',
      email: 'Email',
      website: 'Сайт',
      interested: 'Қызығушылық танытасыз ба?',
      interestedDesc: 'Салмақты шешім қабылдау үшін осы университетті басқалармен салыстырыңыз.',
      goToCompare: 'Салыстыруға өту',
      notFound: 'Университет табылмады',
      notFoundDesc: 'Сұралған университет жоқ.',
    },
    // Compare page
    compare: {
      title: 'Университеттерді салыстыру',
      emptyDesc: 'Сипаттамаларын салыстыру үшін университеттерді қосыңыз',
      comparing: '{count} салыстыру',
      universityWord: 'университет',
      universitiesWord: 'университет',
      clear: 'Тазалау',
      add: 'Қосу',
      slots: 'Салыстыру слоттары',
      tip: 'Кеңес',
      tipText: 'Бір уақытта 3 университетті салыстыруға болады. Толық салыстыру үшін',
      catalog: 'каталогтан',
      forMore: 'көбірек университет қосыңыз.',
      characteristics: 'Сипаттамалары',
      city: 'Қала',
      tuition: 'Оқу құны',
      rating: 'Рейтинг',
      studyForm: 'Оқу түрі',
      dormitory: 'Жатақхана',
      programs: 'Бағдарламалар',
      founded: 'Құрылған жылы',
      students: 'Студенттер',
      contacts: 'Байланыс',
      hasIt: 'Бар',
      noIt: 'Жоқ',
      noData: 'Мәліметтер жоқ',
      na: 'Белгісіз',
      noUniversities: 'Салыстыру үшін университеттер жоқ',
      noUniversitiesDesc: 'Сипаттамаларын қатар көру үшін университеттерді салыстыру тізіміне қосыңыз.',
      goToCatalog: 'Каталогқа өту',
      removeFromCompare: 'Салыстырудан алып тастау',
    },
    // Favorites page
    favorites: {
      title: 'Менің таңдаулыларым',
      emptyDesc: 'Мұнда таңдаулы университеттер көрсетіледі',
      saved: '{count} сақталған',
      universityWord: 'университет',
      universitiesWord: 'университет',
      clearAll: 'Барлығын тазалау',
      empty: 'Таңдаулылар әзірше жоқ',
      emptyText: 'Университеттерді зерттеп, ұнағандарын таңдаулыларға қосыңыз.',
      goToCatalog: 'Каталогқа өту',
      tip: 'Пайдалы ақпарат',
      tipText: 'Сіздің таңдаулыларыңыз осы құрылғыда жергілікті түрде сақталады. Оларға интернетсіз де кез келген уақытта қол жеткізуге болады. Таңдаулы университеттерді салыстыру үшін университет картасындағы салыстыру белгішесін басыңыз.',
    },
    // Footer
    footer: {
      description: 'Қазақстан университеттерін іздеу және салыстыру үшін сандық платформа. Болашақ білім алу үшін тамаша университетті табыңыз.',
      navigation: 'Навигация',
      contacts: 'Байланыс',
      location: 'Астана, Қазақстан',
      rights: 'Барлық құқықтар қорғалған.',
    },
    // Common
    common: {
      loading: 'Жүктелуде...',
      error: 'Қате',
    },
  },
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('studenthub-language')
    return saved || 'ru'
  })

  useEffect(() => {
    localStorage.setItem('studenthub-language', language)
    document.documentElement.lang = language
  }, [language])

  const t = (path) => {
    const keys = path.split('.')
    let value = translations[language]
    for (const key of keys) {
      value = value?.[key]
    }
    return value || path
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ru' ? 'kk' : 'ru')
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export default LanguageContext

