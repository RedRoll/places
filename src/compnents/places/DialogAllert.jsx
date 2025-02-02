import { useRef, useContext, useEffect } from "react"

import { createPortal } from "react-dom"

import { PlaceContext } from "../../shop/shop_place_context"


const DialogAllert = ({ modalState, modalAction }) => {

    const { onPlaceDelete } = useContext(PlaceContext)

    const modal = useRef()

    useEffect(() => {
        if (modalState) { // if modalAction = true
            modal.current.showModal()
        }
        else {
            modal.current.close()
        }
    }, [modalState])

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
        // коли модальне вікно відкрите, його мона закрити клавішою ESC. В такому випадку наступного разу модальне вікно не відкриється при кліці по ньому, бо state === true(state просто не оновиться на false). Для рішення проблеми треба скористатись вбудованим prop <dialog> - onClose() і задати функцію оновлення стану там
        <dialog ref={modal} onClose={() => modalAction(false)} className="p-8 open:flex flex-col items-center gap-y-2 rounded bg-dark-dark backdrop:bg-slate-950/80 border border-customViolet text-customBlue"> {/* open:flex для того, щоб коли dialog===closed сам dialog не був блочним, бо якщо вказати просто flex, то dialog бдуе видно навіть в закритому стані */}
            <h3>You are deleting this place?</h3>
            <form method="dialog" className="flex gap-x-2">
                <button className="bg-dark-dark1 py-1 px-3 rounded hover:bg-neutral-800 border border-customViolet" onClick={onOk}>OK</button>
                <button className="bg-dark-dark1 py-1 px-3 rounded hover:bg-neutral-800 border border-customViolet" onClick={onCancel}>Cancel</button>
            </form>
        </dialog>, document.getElementById('modal')

    )
}

export default DialogAllert