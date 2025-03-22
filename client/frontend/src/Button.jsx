function ButtonComponent() {
  return <div>
    <button type="button" class="btn btn-primary"
        style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
    Login
    </button>
    <button type="button" class="btn btn-outline-primary" disabled>Go to Signup</button>
  </div>

}
export default ButtonComponent;