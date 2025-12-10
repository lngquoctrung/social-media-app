import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";

export const Input = forwardRef(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-1 block text-xs font-medium text-[#a8a8a8]">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={twMerge(
                        clsx(
                            "input-field",
                            error && "border-[#ed4956]",
                            className
                        )
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-xs text-[#ed4956]">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
