import { PlaceContext } from "../../shop/shop_place_context"
import { useContext, useState } from "react"


const CardPlace = ({img, alt, title, click, modalAction}) => {

    const [rotation, setRotation] = useState('')

    const { onPlaceSelect, onTitleUpdate } = useContext(PlaceContext)

   const animationHandler = () => { // визначення напрмку анімації при наведенні на елемент
     const randomRotation = Math.random() < 0.5 ? 'animate-rotateRight' : 'animate-rotateLeft'
     setRotation(() => randomRotation)
   }

   const onDelete = () => {
    modalAction()
    onTitleUpdate(title)
   }

   const leaveAnimationHandler = () => setRotation(() => '')
 
    return (
        <div onMouseLeave={leaveAnimationHandler} onMouseEnter={animationHandler} className={`relative rounded overflow-hidden shadow-lg hover:shadow-cyan-500/50 ${rotation} cursor-pointer`} onClick={click ? () => onPlaceSelect(title) : () => onDelete()}>  
            <img className="" src={img} alt={alt} />
            <h4 className="absolute bottom-6 right-4  bg-customBlue p-0.5 rounded">{title}</h4>
        </div>
    )
}

export default CardPlace