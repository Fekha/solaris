<template>
<div class="row bg-secondary pt-2 pb-2">
    <div class="col">
        <p class="mb-2">Give this player Credits. (You have ${{userPlayer.credits}})</p>

        <form>
            <div class="form-row">
                <div class="col-7 input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">$</span>
                  </div>
                  <input type="number" class="form-control" v-model="amount"/>
                </div>
                <div class="col-5">
                    <modalButton modalName="sendCreditsModal" classText="btn btn-success btn-block">Send Credits</modalButton>
                </div>
            </div>
        </form>
    </div>

    <dialogModal modalName="sendCreditsModal" titleText="Send Credits" cancelText="No" confirmText="Yes" @onConfirm="confirmSendCredits">
      <p>Are you sure you want to send <b>${{amount}}</b> to <b>{{player.alias}}</b>?</p>
    </dialogModal>
</div>
</template>

<script>
import tradeService from '../../../services/api/trade'
import ModalButton from '../../modal/ModalButton'
import DialogModal from '../../modal/DialogModal'

export default {
  props: {
    player: Object,
    userPlayer: Object
  },
  components: {
    'modalButton': ModalButton,
    'dialogModal': DialogModal
  },
  data () {
    return {
      amount: 0
    }
  },
  methods: {
    async confirmSendCredits () {
      try {
        let response = await tradeService.sendCredits(this.$store.state.game._id, this.player._id, this.amount)

        if (response.status === 200) {
          this.$emit('onCreditsSent', this.amount)

          this.$toasted.show(`Sent ${this.amount} credits to ${this.player.alias}.`)

          this.userPlayer.credits -= this.amount
          this.amount = 0
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>
input {
  text-align: center;
}
</style>
