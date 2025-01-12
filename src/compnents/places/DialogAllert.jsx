import { forwardRef, useRef, useImperativeHandle, useContext } from "react"

import { createPortal } from "react-dom"

import { PlaceContext } from "../../shop/shop_place_context"


const DialogAllert = forwardRef( ( {}, ref ) => {

    const { onPlaceDelete } = useContext(PlaceContext)

    const modal = useRef()

    useImperativeHandle( ref, () => {
        return {
            openModal() { modal.current.showModal() }
        }
    } )

    

    return createPortal( 
        <dialog ref={modal} className="p-8 open:flex flex-col items-center gap-y-2 rounded bg-dark-dark backdrop:bg-slate-950/80 border border-customViolet text-customBlue"> {/* open:flex для того, щоб коли dialog===closed сам dialog не був блочним, бо якщо вказати просто flex, то dialog бдуе видно навіть в закритому стані */}
            <h3>You are deleting this place?</h3>
            <form method="dialog" className="flex gap-x-2">
                <button className="bg-dark-dark1 py-1 px-3 rounded hover:bg-neutral-800 border border-customViolet" onClick={onPlaceDelete}>OK</button>
                <button className="bg-dark-dark1 py-1 px-3 rounded hover:bg-neutral-800 border border-customViolet" onClick={() => modal.current.close()}>Cancel</button>
            </form>
        </dialog>,document.getElementById('modal')
    
    )
} )

export default DialogAllert