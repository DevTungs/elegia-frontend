export const scrollToElement = (elementId: string, offset = 80) => {
  const element = document.getElementById(elementId);
  if (!element) return false;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.scrollY - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });

  return true;
};

export const handleAnchorClick = (
  event: React.MouseEvent<HTMLAnchorElement>,
  offset = 80
) => {
  const href = event.currentTarget.getAttribute("href");
  if (!href?.startsWith("#")) return false;

  event.preventDefault();
  const targetId = href.slice(1);
  return scrollToElement(targetId, offset);
};
