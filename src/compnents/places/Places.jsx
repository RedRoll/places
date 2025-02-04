
import { useContext, useState } from "react"
import { PlaceContext } from "../../shop/shop_place_context"

import PlacesContent from "./PlacesContent"
import DialogAllert from "./DialogAllert"


const Places = ({ }) => {

    const [modalIsopen, setModalIsOpen] = useState(false)
    
    const { availablePlaces, addedPlaces} = useContext(PlaceContext)

    return (
        <div className="flex flex-col gap-y-8">
            <PlacesContent title='My wish places.'  modalAction={setModalIsOpen} places={addedPlaces} />
            <PlacesContent title='Available places.' click={true} places={availablePlaces} /> {/*click щоб задіялась функція для альтернативного сценарію(додавання елементів до масиву)*/}
            <DialogAllert  modalState={modalIsopen} modalAction={setModalIsOpen} />
        </div>
    )
}

export default Places