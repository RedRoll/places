// for Reduce
import { createContext, useReducer, useEffect } from "react";
import { AVAILABLE_PLACES } from "../data";

import { sortPlacesByDistance } from "../loc";


export const PlaceContext = createContext({
    addedPlaces: [],
    availablePlaces: [],
    onPlaceSelect: () => { },
    onPlaceDelete: () => { },
    onTitleUpdate: () => { },
    currentTitle: ''
})



const storedSelectedPlaces = JSON.parse(localStorage.getItem('selectedPlaces')) || []

const initialArray = AVAILABLE_PLACES.filter(item => !storedSelectedPlaces.some(storedItem => storedItem.id === item.id))


const placesReducer = (state, action) => {

    const selectedPlace = AVAILABLE_PLACES.find(object => object.title === action.payload) // повертає перший знайдений об`єкт по критерію пошуку

    if (action.type === 'UPDATE_PLACES') {

        const storedPlaces = JSON.parse(localStorage.getItem('selectedPlaces'))

        if (storedPlaces === null || storedPlaces.length <= 0) {
            localStorage.setItem('selectedPlaces', JSON.stringify([selectedPlace]))
        }
        else if (storedPlaces.length > 0) {
            if (!storedPlaces.some(item => item.id === selectedPlace.id)) {
                localStorage.setItem('selectedPlaces', JSON.stringify([selectedPlace, ...storedPlaces]))
                // some() перевіряє чи кожний елемент масиву проходить перевірку, яка задана в функції
                // ! оператор зімнює результат some() на протилежний, тобто, якщо item.id === sorteditem.id some() видасть true, але тоді даний item потрапить до новго масиву, що не потрібно. Для того значення і інвертується
            }
        }



        return {
            ...state,

            addedPlaces: [


                ...JSON.parse(localStorage.getItem('selectedPlaces'))// додавання елментів з localStorage

            ],

            availablePlaces: state.availablePlaces.filter(object => object.title != action.payload)
            // filter() створює новий масив даних зі всіма елементами, які пройшли перевірку
        }



    }

    if (action.type === 'DELETE_PLACE') {

        const storedPlaces = JSON.parse(localStorage.getItem('selectedPlaces'))

        const updatedPlaces = storedPlaces.filter(item => item.title != action.payload) // видалення елементу також з localStorage


        localStorage.setItem('selectedPlaces', JSON.stringify([...updatedPlaces])) // декларування оновленого масиву даних в localStorage

        return {
            ...state,
            // addedPlaces: state.addedPlaces.length >= 0 ? state.addedPlaces.filter(object => object.title != action.payload) : null,
            addedPlaces: JSON.parse(localStorage.getItem('selectedPlaces')),
            // не апдейтило addedPlaces, коли ...state був під addedPlaces.

            availablePlaces: [
                ...state.availablePlaces,
                { ...selectedPlace }
            ]
        }

    }

    if (action.type === 'UPDATE_TITLE') {
        return {
            ...state,
            currentTitle: action.payload
        }
    }

    if (action.type === 'CREATE_ARRAY') {
        return {
            ...state,
            // addedPlaces: action.payload.added,
            availablePlaces: action.payload.available
        }
    }

    return state
}


const PlaceContextProvider = ({ children }) => {


    const [places, placesDispatch] = useReducer(placesReducer, {

        addedPlaces: JSON.parse(localStorage.getItem('selectedPlaces')),
        availablePlaces: null,
        currentTitle: ''
    })

    console.log(places.addedPlaces)
    console.log(places.availablePlaces)

    const createInitialArray = () => {


        // navigator - встроєний метод браузера, який визначає місцезнаходження користувача (питає в користувача дозвіл на визначення геолокації)

        navigator.geolocation.getCurrentPosition(position => { // position - об`єкт який повертає метод navigator (в ньому мітяться дані, які стосуються місцезнаходження користувача)

           
            const sortedPlaces = sortPlacesByDistance(initialArray, position.coords.latitude, position.coords.longitude)


            placesDispatch({
                type: 'CREATE_ARRAY',
                payload: {
                    available: sortedPlaces.map(obj => ({ ...obj })) // глибоке копіювання об`єктів в масив,
                    // added: storedSelectedPlaces ? [...storedSelectedPlaces] : undefined


                }

            })

        })
    }

    // useEffect приймає 2 аргументи. Перший - функція, яка буде виконуватись, другий - залежність (правило при якому перший аргумент (функція) буде виконуватись). Також useEffect не модна використовувати в середині функцій, умов(if else) і так далі.

    // В загальному useEffect потрібний в випадку запобігання безкінечного ре-рендеру або коли потрібно виконати деякий код після основного рендеру jsx-коду

    useEffect(() => {

        setTimeout(() => {

            createInitialArray() // Функція в середині useEffect буде виконана після повного рендеру jsx-коду

        }, 1000)


    }, [])


    // якщо оминути (не задекларувати) путсий масив залежностей - функція в середині useEffect буде виконуватись після кожного ре-рендеру jsx-коду (якщо його задекларувати, навіть просто як пустий масив, то код в середині useEffect вмконається лише раз після стартового рендеру jsx-коду) 


    const handlePlaceToWishPlace = placeTitle => {
        placesDispatch({
            type: 'UPDATE_PLACES',
            payload: placeTitle
        })
    }

    const handleDeletePlace = () => {
        placesDispatch({
            type: 'DELETE_PLACE',
            payload: places.currentTitle
        })
    }

    const updateTitle = title => {
        placesDispatch({
            type: 'UPDATE_TITLE',
            payload: title
        })
    }

    const contextValue = {
        addedPlaces: places.addedPlaces,
        availablePlaces: places.availablePlaces,
        onPlaceSelect: handlePlaceToWishPlace,
        onPlaceDelete: handleDeletePlace,
        onTitleUpdate: updateTitle,
        currentTitle: places.currentTitle
    }

    return <PlaceContext.Provider value={contextValue}>{children}</PlaceContext.Provider>
}

export default PlaceContextProvider

// так багато інфи, що я б розділив це на 2 компоненти, сортуючи дані по відповідності