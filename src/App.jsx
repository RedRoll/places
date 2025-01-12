
import Header from "./compnents/header/Header"
import Places from "./compnents/places/Places"
import PlaceContextProvider from "./shop/shop_place_context"

function App() {


  return (
    <PlaceContextProvider>
      <div className="text-customBlack-darkText ">
        <div className="w-4/5 mx-auto pt-8 flex flex-col gap-y-10">
          <Header />
          <Places />
        </div>
      </div>
    </PlaceContextProvider>
  )
}

export default App
