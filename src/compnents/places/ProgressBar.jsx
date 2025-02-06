import { useState, useEffect } from "react"

const ProgressBar = ({ state, time }) => {

    const [remainingTime, setRemainingTime] = useState(time)

    useEffect(() => {

        if (state) {

            const interval = setInterval(() => { // для шкали

                console.log('- 10')
                setRemainingTime(prevState => prevState - 10)

            }, 10);

            return () => {
                clearInterval(interval)
                setRemainingTime(time)
            }
        }

    }, [state])

    return (
        <progress className="w-[250px] h-[10px] rounded-sm overflow-hidden mt-[10px] [&::-webkit-progress-bar]:bg-white [&::-webkit-progress-value]:bg-customViolet" value={remainingTime} max={time} />
    )
}

export default ProgressBar