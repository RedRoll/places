import Logo from '../../assets/logo.png'


const Header = ({}) => {
    return (
        <div className='flex flex-col items-center text-white gap-y-4'>
            <img src={Logo} alt="Logo" className='w-[150px] border rounded-full border-black'/>
            <h2 className='text-center'>Collect all yours dream places in our app!</h2>
        </div>
    )
}


export default Header