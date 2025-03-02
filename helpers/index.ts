interface DateOptions {
    month?: boolean;
    day?: boolean;
    year?: boolean;
    separator?: string;
}

//TODO: Make this a utility function
export const validateFormHandler = (emailAddress: string, password: string, setValidationErrors: (errors: { email?: string; password?: string }) => void) => {
    const errors: { email?: string; password?: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailAddress) {
        errors.email = "Email is required";
    } else if (!emailRegex.test(emailAddress)) {
        errors.email = "Please enter a valid email address";
    }

    if (!password) {
        errors.password = "Password is required";
    } else if (password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
};

export const truncatedString = (str: string, num: number) => {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
};

export function dateToReadableString(dateInput: Date | string | number): string {
    // Ensure we have a valid Date object
    const date = new Date(dateInput);

    // Check if date is valid
    if (isNaN(date.getTime())) {
        console.warn('Invalid date provided to dateToReadableString:', dateInput);
        return 'Invalid date';
    }

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export function getDateComponents(dateInput: Date | string | number, options: DateOptions = {}): string {
    // Ensure we have a valid Date object
    const date = new Date(dateInput);

    // Check if date is valid
    if (isNaN(date.getTime())) {
        console.warn('Invalid date provided to getDateComponents:', dateInput);
        return 'Invalid date';
    }

    // Default options
    const config: Required<DateOptions> = {
        month: options.month ?? true,
        day: options.day ?? true,
        year: options.year ?? true,
        separator: options.separator || " ",
    };

    // Use direct Date methods instead of string parsing
    const components: string[] = [];

    if (config.month) {
        // Get month name directly using Intl.DateTimeFormat
        const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
        components.push(monthName);
    }

    if (config.day) {
        components.push(date.getDate().toString());
    }

    if (config.year) {
        components.push(date.getFullYear().toString());
    }

    // Handle case where no components were requested
    if (components.length === 0) {
        return dateToReadableString(date);
    }

    return components.join(config.separator);
}

export function getDateComponent(dateInput: Date | string | number, component: 'month' | 'day' | 'year'): string {
    const date = new Date(dateInput);

    if (isNaN(date.getTime())) {
        console.warn(`Invalid date provided to getDateComponent:`, dateInput);
        return 'Invalid date';
    }

    switch (component) {
        case 'month':
            return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
        case 'day':
            return date.getDate().toString();
        case 'year':
            return date.getFullYear().toString();
        default:
            return '';
    }
}