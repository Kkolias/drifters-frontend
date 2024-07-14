<template>
  <div class="component-footer">
    <div class="contact-section">
      <p>
        Onko sinulla kehitysidea tai havaitsitko virheen?
        <a href="mailto:driftdataan@gmail.com"> driftdataan@gmail.com </a>
      </p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.component-footer {
  width: 100%;
  border-top: 1px solid var(--green-1-50);
  margin-top: 12px;
//   box-shadow: 0px -2px 12px var(--black-dark);
  padding: 12px 0;

  .contact-section {
    text-align: center;

    a {
      color: var(--green-1);
    }
  }
}
</style>
