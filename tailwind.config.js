/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          dark: '#121212',
          dark1: '#1E1E1E',
          // darkT: '#E0E0E0'
        },
        customBlue: '#03DAC6',
        customViolet: '#BB86FC'
      },
      textStroke: {
        '1': '.5px',
        '2': '2px'
      },
      textStrokeColor: {
        white1: '#FFFFFF'
      },

      animation: {
        rotateRight: 'rotateRight 1.5s linear forwards',
        rotateLeft: 'rotateLeft 1.5s linear forwards'
      },
      keyframes: {
        rotateRight: {
          '0%' : { transform: 'rotate(odeg)' },
          '100%' : { transform: 'rotate(7deg)' }
        },
        rotateLeft: {
          '0%' : { transform: 'rotate(odeg)' },
          '100%' : { transform: 'rotate(-7deg)' }
        }
      }
    },
  },
  plugins: [


    // функція, яка додає кастомні утиліти для text stroke width/color (я називаю це кастомними класами)

    function ({ addUtilities, theme }) { // addUtilities - використовується для додавання нової класової утиліти (тобто новго класу в tailwindCss) / theme використовується для того, щоб отримати значення з theme об`єкту в якому були прописані кастомні класи (наприклад - 'textStroke')

      const strokeUtilites = Object.entries(theme('textStroke')).map(([key, value]) => ({
        [`.text-stroke-${key}`]: {
          '-webkit-text-stroke-width': value
        }
      }))

      // Object.entries повертає масив властивостей вказаного об`єкту в форматі [key, value], далі за допомогою map ці дані ітеруються в CSS об`єкт

      const strokeColorUtilities = Object.entries(theme('textStrokeColor')).map(([key, value]) => ({
        [`.text-stroke-${key}`]: {
          '-webkit-text-stroke-color': value
        }
      }))

      addUtilities(strokeUtilites)
      addUtilities(strokeColorUtilities)

    }

  ],
}


// закінчив тут, додаю кастомні класи

