import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.tsx',
        './resources/js/**/*.ts',
    ],

    theme: {
        extend: {
            colors: {
                cream: '#FDF8F3',
                blush: '#F9EBEA',
                lavender: '#F3F0F8',
                rose: '#D44D5C',
                'rose-hover': '#BF4350',
                burgundy: '#7B2D3E',
                sage: '#A3B5A6',
                gold: '#C9A96E',
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                display: ['Playfair Display', 'serif'],
                accent: ['Cormorant Garamond', 'serif'],
            },
        },
    },

    plugins: [forms],
};
