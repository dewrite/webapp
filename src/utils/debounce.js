export default function debounce(func, timeout = 800){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

// export default function debounce(func, timeout = 300){
//   let timer;
//   console.log('in nn debounce');
//   return (...args) => {
//     if (!timer) {
//       func.apply(this, args);
//     }
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       timer = undefined;
//     }, timeout);
//   };
// }

// export default function debounce(func, wait = 300, immediate) {
//   var timeout;
//   console.log('in nn debounce');
//   return function executedFunction() {
//     var context = this;
//     var args = arguments;

//     var later = function() {
//       timeout = null;
//       if (!immediate) func.apply(context, args);
//     };

//     var callNow = immediate && !timeout;
	
//     clearTimeout(timeout);

//     timeout = setTimeout(later, wait);
	
//     if (callNow) func.apply(context, args);
//   };
// };