<script lang="ts">
import { watch, defineComponent, ref, onMounted } from 'vue'
import { usePermissionsStore } from '@/stores'
import { objectIsKrnArg, krnArgIsValid } from '@/helpers/permissions'

export default defineComponent({
  name: 'AuthValidate',
  props: {
    krnArgs: {
      type: Object,
      required: true,
      validator: (args) => {
        // If args is just set to the default empty object, return true
        if (!Object.keys(args).length) {
          return true
        }

        // If args is a valid krn arg
        if (objectIsKrnArg(args)) {
          return true
        }

        let requestedKrnDictionaryIsValid = true

        for (const [key, krnArgs] of Object.entries(args)) {
          if (['product', 'action', 'resourcePath'].includes(key)) {
            requestedKrnDictionaryIsValid = false
            // Log error to help developer find invalid key
            console.error(`Invalid krn object key: ${key}`)
            break
          }

          if (!krnArgIsValid(krnArgs)) {
            requestedKrnDictionaryIsValid = false
            break
          }
        }

        return requestedKrnDictionaryIsValid
      }
    }
  },
  setup (props, { slots }) {
    const { canUserAccess } = usePermissionsStore()
    const accessDictionary = ref({})

    const evaluatePermissions = async () => {
      // Create a non-reactive object to assemble the access dictionary
      let tempAccessDictionary = {}

      // If props.krnArgs is a single set of krnArgs and is not a dictionary, map it to 'isAllowed' and assign the boolean
      if (objectIsKrnArg(props.krnArgs)) {
        if (krnArgIsValid(props.krnArgs)) {
          tempAccessDictionary = {
            isAllowed: await canUserAccess(props.krnArgs)
          }
        } else {
          tempAccessDictionary = {
            isAllowed: false
          }
        }
      } else {
        for (const [key, krnArgs] of Object.entries(props.krnArgs)) {
          if (key && !krnArgs) {
            tempAccessDictionary[key] = false
          } else {
            tempAccessDictionary[key] = await canUserAccess(krnArgs)
          }
        }
      }

      // Set reactive ref value to evaluated object
      accessDictionary.value = tempAccessDictionary
    }

    // Revaluate permissions if prop changes
    watch(() => props.krnArgs, () => {
      evaluatePermissions()
    }, { deep: true, immediate: true })

    onMounted(() => {
      evaluatePermissions()
    })

    return () => slots && slots.default({
      ...accessDictionary.value
    })
  }

})
</script>
