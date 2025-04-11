import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-rose-100 text-neutral-50 focus:border-rose-100'
                    : 'border-transparent text-neutral-200 hover:border-rose-100 hover:text-rose-100 focus:border-rose-100 focus:text-rose-100') +
                className
            }
        >
            {children}
        </Link>
    );
}
