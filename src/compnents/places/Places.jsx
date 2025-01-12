
import { useContext, useRef } from "react"
import { PlaceContext } from "../../shop/shop_place_context"

import PlacesContent from "./PlacesContent"
import DialogAllert from "./DialogAllert"


const Places = ({ }) => {
    const dAllert = useRef()

    const { availablePlaces, addedPlaces} = useContext(PlaceContext)

    const action = () => dAllert.current.openModal()

    return (
        <div className="flex flex-col gap-y-8">
            <PlacesContent title='My wish places.'  modalAction={action} places={addedPlaces} />
            <PlacesContent title='Available places.' click={true} places={availablePlaces} /> {/*click щоб задіялась функція для альтернативного сценарію(додавання елементів до масиву)*/}
            <DialogAllert ref={dAllert} />
        </div>
    )
}


export default Places