<template>
<div class="row bg-secondary pt-2 pb-2">
    <div class="col">
        <form>
            <div class="form-row">
                <div class="col-7 ">
                    <p class="mb-2">You are at war with this player.</p>
                </div>
                <div class="col-5">
                    <modalButton modalName="requestAllianceModal" classText="btn btn-success btn-block">Request Alliance for ${{amount}}</modalButton>
                </div>
            </div>
        </form>
    </div>

    <dialogModal modalName="requestAllianceModal" titleText="Request Alliance" cancelText="No" confirmText="Yes" @onConfirm="confirmRequestAlliance">
      <p>Request Alliance For <b>${{amount}}</b> with <b>{{player.alias}}</b>?</p>
    </dialogModal>
</div>
</template>

<script>
import DiplomacyService from '../../../services/api/diplomacy'
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
      amount: 150
    }
  },
  methods: {
    async confirmRequestAlliance () {
      try {
        let response = await DiplomacyService.requestAlliance(this.$store.state.game._id, this.player._id)

        if (response.status === 200) {
          this.$emit('onAllianceRequestSent', this.amount)

          this.$toasted.show(`Formal Alliance Created with ${this.player.alias}.`)

          this.userPlayer.credits -= this.amount
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
