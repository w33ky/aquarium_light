export function createTimeout(ms: number): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject("Timed out in " + ms + "ms.");
    }, ms);
  });
}
