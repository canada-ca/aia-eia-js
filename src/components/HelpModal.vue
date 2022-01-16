<template>
  <div id="helpModal" class="modalS" role="dialog">
    <div class="modalS-content">
      <span class="closeS">&times;</span>
      <div id="helpText"></div>
    </div>
  </div>
</template>
<style>
/* The Modal (background) */
.modalS {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content */
.modalS-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

/* The Close Button */
.closeS {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  margin-left: 20px;
}

.closeS:hover,
.closeS:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>
