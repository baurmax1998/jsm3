
    /**
  * @name square
  * @function
  * @description calc the surface of a square
  * @param {nummber} a one side
  * @param {nummber} b other side
  * @returns {number}
  */
 function square(a, b) {
   return a * b;
 }    process.send({ result: square(12, 12) })
    