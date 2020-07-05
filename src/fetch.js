export const doFetch = (path) => {
  return fetch("https://api.github.com/users/" + path).then(
    (res) => {
      if (res.ok) {
        return res.json();
      }
      throw res;
    }
  );
};
