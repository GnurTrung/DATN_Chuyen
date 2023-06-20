export const formatWallet = (address: any) => {
  if (!address) return "";
  return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
};
export const formatBalance = (value: any) => {
  return Number(value || 0) / 10 ** 9;
};
export const isDateGreater = (date1: any, date2: any) => {
  return date1 - date2 <= 0 ? false : true;
};

export const getFullImageSrc = (src: string) => {
  if (!src) return undefined;
  let fullSrc = src;
  if (src.startsWith("ipfs://")) {
    fullSrc = `https://ipfs.io/ipfs/${src.slice(7)}`;
  }
  return fullSrc;
};

export const isVideo = (url: string) => {
  return /\.(mp3|mp4|wav|ogg)$/.test(url);
};

export const getVideoType = (url: string) => {
  const types = ["mp4", "wav", "ogg"];
  let videoType = "";
  for (let type of types) {
    if (url.endsWith(type)) {
      videoType = `video/${type}`;
      break;
    }
  }
  return videoType;
};
export const openWindowTab = ({ url, title, w, h }: any) => {
  // Fixes dual-screen position                             Most browsers      Firefox
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : window.screen.width;
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : window.screen.height;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;
  window.open(
    url,
    title,
    `
    scrollbars=yes,
    width=${w / systemZoom}, 
    height=${h / systemZoom}, 
    top=${top}, 
    left=${left}
    `
  );

  //if (window.focus) newWindow.focus();
};
