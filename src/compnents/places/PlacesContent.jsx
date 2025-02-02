import CardPlace from "./CardPlace"


const PlacesContent = ({ places, click, title, modalAction }) => {


    return (
        <>
            <h3 className="text-customBlue">{title}</h3>
          
            {places === null ? 
            (
                <h3 className="text-white text-lg uppercase font medium text-center mb-5">Loading...</h3>
            )

                :

               places.length === 0 ? (<p className="text-white">No added places yet...</p>)

                    // після затримки в 2с, (useEffect в shop запускає функцію створювання даних через 2 с від початку рендеру) якщо addedplaces буде null - змінити loading на 'місць ще не додано'
                    :
                    (
                        <div className="grid lg:grid-cols-4 md:grid-cols-3 min-[320px]:grid-cols-2 gap-3  ">{places.map(item =>

                        (<CardPlace
                            modalAction={() => modalAction(true)}
                            key={item.id}
                            img={item.image.src}
                            alt={item.image.alt}
                            title={item.title}
                            click={click}
                        />

                        ))}

                        </div>
                    )}
        </>
    )
}

export default PlacesContent