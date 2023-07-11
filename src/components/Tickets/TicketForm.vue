<template>
    <KModal
          title="Raise a ticket"
          :is-visible="visible"
          text-align="left"
          class="ticketModal"
          @proceed="$emit('submitted')"
          @canceled="$emit('cancelled')">

          <template v-slot:header-content>
            <KIcon icon="kong" class="mr-2" />
            Raise ticket
          </template>
          <template v-slot:body-content>
            <div>
              Please complete this form to raise a new ticket on the <!--{{ product.title }}--> API product:
            </div>
            <div style="height: 10px;"></div>
            <KInput class="w-100" label="Developer Email" placeholder="Developer Email"  v-model="formData.developerId" />
            <div style="height: 10px;"></div>
            <KSelect class="w-100" label="Priority" :items="ticketPriority" v-model="formData.priority" />
            <div style="height: 10px;"></div>
            <KSelect class="w-100" label="Service Path" :items="paths" v-model="formData.servicePath"/>
            <div style="height: 10px;"></div>
            <KSelect class="w-100" label="Request Type" :items="ticketItems" v-model="formData.requestType"/>
            <div style="height: 10px;"></div>
            <KTextArea class="w-100" label="Issue Details" v-model="formData.issueDetails"/>
          </template>
          <template v-slot:action-buttons>
            <KButton
              appearance="primary"
              @click="handleSubmit(formData)">Raise Ticket</KButton>
          </template>
      </Kmodal>

</template>

<script lang="ts">
import { SelectItem } from '@kong/kongponents/dist/types'
import { defineEmits, handleError, ref } from 'vue'
import { session } from '@/services'
import { TicketPayload } from '@/ticketPayload'
export default {
  name: 'TicketForm',
  props: {
    visible: {
      type: Boolean
    },
    loading: {
      type: Boolean,
      default: false
    },
    paths: {
      type: Array<SelectItem>
    }
  },
  setup (_, ctx) {
    const emit = defineEmits(['cancelled', 'submitted'])
    function makeDefaultFormData (email: string): TicketPayload {
      const returnObject = {
        developerId: email,
        priority: '',
        servicePath: '',
        requestType: '',
        issueDetails: ''
      }
      return returnObject
    }
    function handleSubmit(data) {
      const ticketFormData: TicketPayload = makeDefaultFormData(email)
      this.formData = ref(ticketFormData)
      ctx.emit('submitted', data)
    }
    const email = session.getUser().email
    const ticketFormData: TicketPayload = makeDefaultFormData(email)
    const formData = ref(ticketFormData)
    return { formData, handleSubmit }
  },
  data () {
    
    const email = session.getUser().email
    const ticketPriority:SelectItem[] = [
      {
        label: '1 - High',
        value: 'High',
        selected: false
      },
      {
        label: '2 - Medium',
        value: 'Medium',
        selected: false
      },
      {
        label: '3 - Moderate',
        value: 'Moderate',
        selected: false
      },
      {
        label: '4 - Low',
        value: 'Low',
        selected: false
      }]
    const ticketItems:SelectItem[] = [
      {
        label: 'Bug',
        value: 'Bug',
        selected: false },
      {
        label: 'Documentation',
        value: 'Documentation',
        selected: false },
      {
        label: 'Performance',
        value: 'Performance',
        selected: false },
      {
        label: 'Feature Request',
        value: 'Feature',
        selected: false }
    ]
    return {
      ticketItems, ticketPriority, email
    }
  }
}
/*export default defineComponent({
  name: 'TicketForm',
  components: { },
  setup () {
    
    /*const handleSubmit = () => {
      send('CLICKED_SUBMIT')
      portalApiV2.value.service.applicationsApi
        .createApplication({
          createApplicationPayload: cleanupEmptyFields(formData.value) as CreateApplicationPayload
        })
        .then((res) => {
          if (isDcr.value) {
            secretModalIsVisible.value = true
            applicationId.value = res.data.id
            clientId.value = res.data.credentials?.client_id
            clientSecret.value = res.data.credentials?.client_secret
          } else {
            handleSuccess(res.data.id, 'created')
          }
        })
        .catch((error) => handleError(error))
    }
    const handleUpdate = () => {
      send('CLICKED_SUBMIT')
      portalApiV2.value.service.applicationsApi
        .updateApplication({
          applicationId: id.value,
          updateApplicationPayload: cleanupEmptyFields(formData.value) as { name: string, [x: string]: any }
        })
        .then((res) => handleSuccess(res.data.id, 'updated'))
        .catch((error) => handleError(error))
    }
    const handleSuccess = (id: string, action: string): void => {
      send('RESOLVE')
      notify({
        message: `Application successfully ${action}`
      })
    }*/
/*
    return {
    }
  }
})*/
</script>
<style lang="scss">
  .ticketModal .k-modal-dialog.modal-dialog {
    margin-top: 100px;
  }
</style>

<style lang="scss" scoped>
</style>