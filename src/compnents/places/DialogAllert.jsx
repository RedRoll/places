import { useRef, useContext, useEffect } from "react"

import { createPortal } from "react-dom"

import { PlaceContext } from "../../shop/shop_place_context"

import ProgressBar from "./ProgressBar"

const TIMER = 3000

const DialogAllert = ({ modalState, modalAction }) => {

    // const [remainingTime, setRemainingTime] = useState(TIMER)

    const { onPlaceDelete } = useContext(PlaceContext)

    const modal = useRef()


    useEffect(() => {
        if (modalState) { // if modalAction = true
            modal.current.showModal()

            // setTimeout/setInterval теж є sideEffect, як useEffect

            const timer = setTimeout(() => { // для закриття вікна
                console.log('timer set')
                modalAction(() => false)
                onPlaceDelete()
            }, TIMER)

            return () => {
                console.log('cleaning timer')
                clearTimeout(timer)
            }
            // return це функція, яка 'прибирає/чистить' в середині useEffect. Вона запускається коли залежність(modalState) змінюється(відразу перед тим, як новий ефект буде перезапущений). Також вона запускається, коли компонент unmounts.
        }
        else {
            modal.current.close()
        }


    }, [modalState])

    // також замість змінної можна використовувати функцію, як залежність, але тоді в деяких випадках це може призвезти до нескінченного циклу. Функцію? функція завжди однакова. Ні, це не так. Кожен раз коли виконується новий рендер функція, яка є залежністю теж виконується з початку. JS так працює, що та сама функція, яка виконана ще раз після ре-рендеру вже не буде === старій функції

    // Функція є JS об'єктом. JS так працює, що якщо створити новий об'єкт з ідентичними даними до старого об'єкту ці 2 об'єкти не будуть ідентичними, навіть якщо вони мають ідентичний код всередині. І це може спричинити безкінечний цикл. Хук useCallback запобігає появі безкінечного циклу.

    // В цьому реакт проекті використовується useReducer - функція reducer не змінюється між рендерами. Навіть якщо б залежністю useEffect була б функція, то використання useCallback будло б не потрібне. (але це тільки в випадках reducer function)

    // якщо задекларувати просто так:
    // if (modalAction) {
    //     modal.current.showModal()
    // }
    // else {
    //     modal.current.close()
    // }
    // буде помилка бо на стартовому рендері modal = undefined, для того треба скористуватись useEffect, бо цей хук буде виконуватись після повного рендеру jsx(коли modal вже буде мати прив`язку)


    const onCancel = () => {
        modalAction(false)
        modal.current.close()
    }

    const onOk = () => {
        modalAction(false)
        onPlaceDelete()
    }



    return createPortal(
        // коли модальне вікно відкрите, його можна закрити клавішою ESC. В такому випадку наступного разу модальне вікно не відкриється при кліці по ньому, бо state === true(state просто не оновиться на false). Для рішення проблеми треба скористатись вбудованим prop <dialog> - onClose() і задати функцію оновлення стану там
        <dialog ref={modal} onClose={() => modalAction(false)} className="p-8 open:flex flex-col items-center gap-y-2 rounded bg-dark-dark backdrop:bg-slate-950/80 border border-customViolet text-customBlue"> {/* open:flex для того, щоб коли dialog===closed сам dialog не був блочним, бо якщо вказати просто flex, то dialog бдуе видно навіть в закритому стані */}
            <h3>You are deleting this place?</h3>
            <form method="dialog" className="flex gap-x-2">
                <button className="bg-dark-dark1 py-1 px-3 rounded hover:bg-neutral-800 border border-customViolet" onClick={onOk}>OK</button>
                <button className="bg-dark-dark1 py-1 px-3 rounded hover:bg-neutral-800 border border-customViolet" onClick={onCancel}>Cancel</button>
            </form>
            <ProgressBar state={modalState} time={TIMER}/>

            {/*Шкала, яка обчислюється для progress bar оновлюється дуже часто. І при кожному оновленні реакт перевиконує весь цей JSX код + інші функції, що з точки зору оптимізації не є правильним підходом. Щоб оптимізувати цей момент краще винести progress в окремий компонет. Тоді при обчислюванні шкали перевиконуватись буде тільки progress*/}
        </dialog>, document.getElementById('modal') 

    )
}

export default DialogAllert