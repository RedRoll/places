import { useRef, useContext, useEffect } from "react"

import { createPortal } from "react-dom"

import { PlaceContext } from "../../shop/shop_place_context"


const DialogAllert = ({ modalAction, modalClose }) => {

    const { onPlaceDelete } = useContext(PlaceContext)

    const modal = useRef()

    useEffect(() => {
        if (modalAction) { // if modalAction = true
            modal.current.showModal()
        }
        else {
            modal.current.close()
        }
    }, [modalAction])

    // якщо задекларувати просто так:
    // if (modalAction) {
    //     modal.current.showModal()
    // }
    // else {
    //     modal.current.close()
    // }
    // буде помилка бо на стартовому рендері modal = undefined, для того треба скористуватись useEffect, бо цей хук буде виконуватись після повного рендеру jsx(коли modal вже буде мати прив`язку)



    // useImperativeHandle( ref, () => {
    //     return {
    //         openModal() { modal.current.showModal() },
    //         closeModal() { modal.current.close() }
    //     }
    // } )



    const onCancel = () => {
        modalClose(false)
        modal.current.close()
    }

    const onOk = () => {
        modalClose(false)
        onPlaceDelete()
    }



    return createPortal(
        <dialog ref={modal} className="p-8 open:flex flex-col items-center gap-y-2 rounded bg-dark-dark backdrop:bg-slate-950/80 border border-customViolet text-customBlue"> {/* open:flex для того, щоб коли dialog===closed сам dialog не був блочним, бо якщо вказати просто flex, то dialog бдуе видно навіть в закритому стані */}
            <h3>You are deleting this place?</h3>
            <form method="dialog" className="flex gap-x-2">
                <button className="bg-dark-dark1 py-1 px-3 rounded hover:bg-neutral-800 border border-customViolet" onClick={onOk}>OK</button>
                <button className="bg-dark-dark1 py-1 px-3 rounded hover:bg-neutral-800 border border-customViolet" onClick={onCancel}>Cancel</button>
            </form>
        </dialog>, document.getElementById('modal')

    )
}

export default DialogAllert