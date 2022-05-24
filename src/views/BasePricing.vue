<template>
  <div class="pricing">

    <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
      <h1 class="display-4">Pricing</h1>
      <p class="lead">How much does the success of <em>your</em> students matter to you? How about the performance of
        the seeds of civilization? Choose your plan wisely?</p>
    </div>

    <div class="container">
      <div class="card-deck mb-3 text-center">
        <div class="card mb-4 box-shadow">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Free</h4>
          </div>
          <div class="card-body">
            <h1 class="card-title pricing-card-title">€0 <small class="text-muted">/ mo</small></h1>
            <ul class="list-unstyled mt-3 mb-4">
              <li>10 repo limit</li>
              <li>Basic visualizations</li>
              <li>Email support</li>
            </ul>
          </div>
          <div class="card-footer bg-transparent border-top-0">
            <button type="button" class="btn btn-lg btn-block btn-outline-primary">Sign up for free</button>
          </div>
        </div>
        <div class="card mb-4 box-shadow">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Pro</h4>
          </div>
          <div class="card-body">
            <h1 class="card-title pricing-card-title">€39 <small class="text-muted">/ mo</small></h1>
            <ul class="list-unstyled mt-3 mb-4">
              <li>100 repo limit</li>
              <li>All visualizations</li>
              <li>Email support</li>
              <li>Discord development server access</li>
            </ul>
          </div>
          <div class="card-footer bg-transparent border-top-0">
            <button type="button" class="btn btn-lg btn-block btn-primary">Get started</button>
          </div>
        </div>
        <div class="card mb-4 box-shadow">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Enterprise</h4>
          </div>
          <div class="card-body">
            <h1 class="card-title pricing-card-title">€99 <small class="text-muted">/ mo</small></h1>
            <ul class="list-unstyled mt-3 mb-4">
              <li>Unlimited groups</li>
              <li>Premium visualizations</li>
              <li>Priority phone and email support</li>
              <li>Discord development server access</li>
              <li>Maintainer access to Cognate development repository</li>
            </ul>
          </div>
          <div class="card-footer bg-transparent border-top-0">
            <button type="button" class="btn btn-lg btn-block btn-primary">Contact us</button>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
export default {
  name: 'BasePricing',
}
</script>
