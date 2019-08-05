<template>
  <svg width="100%" height="100%">
    <!-- Define the pattern -->
    <pattern id="pattern-cubes" x="0" y="126" patternUnits="userSpaceOnUse" width="31.5" height="50" viewBox="0 0 10 16">
      <!-- Cube code courtest of SVGeneration: http://www.svgeneration.com/recipes/3D-Cubes/ -->
      <g id="cube">
        <!-- We'll apply the `fill` in the CSS for flexibility -->
        <path class="left-shade" d="M0 0l5 3v5l-5 -3z" />
        <path class="right-shade" d="M10 0l-5 3v5l5 -3" />
      </g>
      <!-- Apply the cube shapes -->
      <use x="5" y="8" xlink:href="#cube" />
      <use x="-5" y="8" xlink:href="#cube" />
    </pattern>
    <!-- The canvas for our pattern -->
    <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-cubes)" />
  </svg>
</template>
<style lang="scss">
$fill: rgba(87, 0, 226, 0.918);

.left-shade {
  fill: $fill;
}

.right-shade {
  fill: lighten($fill, 30%);
}
</style>
