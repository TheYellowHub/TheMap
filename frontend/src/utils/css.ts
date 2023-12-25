const getRoot = () => (document.querySelector(":root")! as HTMLElement);
export const getProperty = (property: string) => getComputedStyle(getRoot()).getPropertyValue(property);
export const setProperty = (property: string, value: string) => getRoot().style.setProperty(property, value);