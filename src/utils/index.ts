export function toQueryString(params: Record<string, any>): string {
    if (!params) return '';
    return Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(
            ([k, v]) =>
                encodeURIComponent(k) +
                '=' +
                encodeURIComponent(
                    typeof v === 'object' ? JSON.stringify(v) : String(v)
                )
        )
        .join('&');
}

export const getCompanyInitial = (company: string) => {
    return company.charAt(0).toUpperCase();
};

export const getEmailInitial = (email: string) => {
    return email.charAt(0).toUpperCase();
};