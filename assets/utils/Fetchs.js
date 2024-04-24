// fonction principale qui permet de faire un fetch
export const fetchAnything = async (uri) => {
    try {
        const response = await fetch(uri);

        if (response.ok) { // .success || .ok
            const data = await response.json();

            console.log("fetchAnything() -> data = ", data);

            return data;
        }
    } catch(error) {
        console.error(error);
    }

    return null;
  }
