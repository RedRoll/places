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



const storedSelectedPlaces = JSON.parse(localStorage.getItem('selectedPlaces')) || [] // виконується один раз - при першому рендері

const initialArray = AVAILABLE_PLACES.filter(item => !storedSelectedPlaces.some(storedItem => storedItem.id === item.id))


const placesReducer = (state, action) => {

    // action.payload відповідає актуальному placesDispatch(залежить від action.type), який був задіяний в даний момент

    const selectedPlace = AVAILABLE_PLACES.find(object => object.title === action.payload) // повертає перший знайдений об`єкт по критерію пошуку

    // виконується кожен раз, коли запускається один зі сценаріїв placesDispath
    const storedPlaces = JSON.parse(localStorage.getItem('selectedPlaces')) || [] // распакоука з локалсторадж актуальних даних 
    // оператор 'або' викристовуєься для випадку, коли localStorage === null, тоді повернеться путсий масив

    

    if (action.type === 'UPDATE_PLACES') {

        if (storedPlaces === null || storedPlaces.length <= 0) {

            storedPlaces.push(selectedPlace)

        }
        else if (storedPlaces.length > 0) {
            if (!storedPlaces.some(item => item.id === selectedPlace.id)) {

                storedPlaces.push(selectedPlace)
                // some() перевіряє чи кожний елемент масиву проходить перевірку, яка задана в функції, якщо хоча б один елемент проходить первірку .some() повертає true, якщо ні - false

                // ! оператор зімнює результат some() на протилежний.
            }
        }

        localStorage.setItem('selectedPlaces', JSON.stringify([...storedPlaces]))

        return {
            ...state,

            addedPlaces: storedPlaces,

            availablePlaces: state.availablePlaces.filter(object => object.title != action.payload)
            // filter() створює новий масив даних зі всіма елементами, які пройшли перевірку
        }



    }

    if (action.type === 'DELETE_PLACE') {



        const updatedPlaces = storedPlaces.filter(item => item.title != action.payload) // видалення елементу також з localStorage


        localStorage.setItem('selectedPlaces', JSON.stringify([...updatedPlaces])) // декларування оновленого масиву даних в localStorage



        return {
            ...state,
            // addedPlaces: state.addedPlaces.length >= 0 ? state.addedPlaces.filter(object => object.title != action.payload) : null,
            addedPlaces: updatedPlaces,
            // не апдейтило addedPlaces, коли ...state був під addedPlaces.

            availablePlaces: [
                ...state.availablePlaces,
                { ...selectedPlace }
            ],
            modal: false
        }

    }

    if (action.type === 'UPDATE_TITLE') {
        return {
            ...state,
            currentTitle: action.payload // 
        }
    }

    if (action.type === 'CREATE_ARRAY') {
        return {
            ...state,
            availablePlaces: action.payload
        }
    }

    return state
}


const PlaceContextProvider = ({ children }) => {


    const [places, placesDispatch] = useReducer(placesReducer, {

        addedPlaces: storedSelectedPlaces,
        availablePlaces: null,
        currentTitle: '',
        modal: false
    })



    const createInitialArray = () => {


        // navigator - встроєний метод браузера, який визначає місцезнаходження користувача (питає в користувача дозвіл на визначення геолокації)

        navigator.geolocation.getCurrentPosition(position => { // position - об`єкт який повертає метод navigator (в ньому мітяться дані, які стосуються місцезнаходження користувача)


            const sortedPlaces = sortPlacesByDistance(initialArray, position.coords.latitude, position.coords.longitude)


            placesDispatch({
                type: 'CREATE_ARRAY',
                payload: sortedPlaces.map(obj => ({ ...obj })) // глибоке копіювання об`єктів в масив,

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
