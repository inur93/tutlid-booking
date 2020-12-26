

export function getFormdataById<T>(id: string): T {
    const form = document.getElementById(id) as HTMLFormElement;
    const formData = new FormData(form);
    const object = Object.fromEntries(formData.entries());
    const keys = Object.keys(object);

    return keys.reduce((data: any, key) => {
        const input = form.elements.namedItem(key) as HTMLInputElement;

        switch (input.type) {
            case 'number':
                data[key] = input.valueAsNumber;
                break;
            case 'date':
                data[key] = input.valueAsDate;
                break;
            default:
                data[key] = input.value;
                break;
        }
        return data;
    }, {}) as unknown as T;
}