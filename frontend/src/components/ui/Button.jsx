import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const Button = ({
    children,
    className,
    variant = "primary",
    ...props
}) => {
    const baseStyles =
        "inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-[#0095f6] text-white hover:bg-[#1877f2]",
        secondary: "bg-[#363636] text-white hover:bg-[#262626]",
        ghost: "bg-transparent text-white hover:bg-[#1a1a1a]",
        danger: "bg-[#ed4956] text-white hover:bg-[#dc2743]",
    };

    return (
        <button
            className={twMerge(clsx(baseStyles, variants[variant], className))}
            {...props}
        >
            {children}
        </button>
    );
};
