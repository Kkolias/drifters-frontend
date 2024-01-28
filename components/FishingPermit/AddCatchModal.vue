<template>
    <div class="component-AddCatchModal">
        <Modal :value="modalOpen" @close="closeModal()">
            <div class="form-wrapper">
                <h1>Lisää saalis</h1>
                <form @submit.prevent="e => submit(e)">
                    <div v-if="overViewErrorMessage.length" class="error-wrapper">
                        <p class="error-message">{{ overViewErrorMessage }}</p>
                    </div>

                    <div class="input-wrapper">
                        <label for="fishSpecie">Kalalaji:</label>
                        <SingleSelect class="single-select" placeholderOption="Kalalaji" id="fishSpecie"
                            :value="selectedFish" :optionList="fishSpeciesOptionList" @select="selectFishSpecie" />
                        <!-- <ErrorHover :errorMessage="errorTexts.firstName" /> -->
                    </div>
                    <div class="input-wrapper">
                        <label for="weight">Paino (g):</label>
                        <input v-model="weightInGramsString" type="text"
                            :class="{ error: errorTexts.weightInGramsString.length }" id="weight"
                            @click="setErrorTextsDefault()">
                        <ErrorHover :errorMessage="errorTexts.weightInGramsString" />
                    </div>
                    <div class="button-wrapper">
                        <ButtonWithLoader buttonType="submit" :loading="loading" :disabled="!canSubmit">
                            <span>
                                Tallenna
                            </span>
                        </ButtonWithLoader>
                    </div>
                </form>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { fishSpeciesOptionList } from '~/constants/fish-species'
import fishingPermitApi from '~/utils/api-fishing-permits'

interface ErrorTexts {
    weightInGramsString: string
}

interface AddCatchModalData {
    fishSpeciesOptionList: readonly { key: string, label: string }[],
    selectedFish: {
        key: string,
        label: string
    } | null
    weightInGramsString: string,

    errorTexts: ErrorTexts
    overViewErrorMessage: string

    loading: boolean
}

export default {
    props: {
        permitId: {
            type: String,
            default: ''
        },
        modalOpen: {
            type: Boolean,
            default: false
        }
    },
    data: (): AddCatchModalData => ({
        fishSpeciesOptionList,
        selectedFish: null,
        weightInGramsString: '0',



        errorTexts: {
            weightInGramsString: ''
        },
        overViewErrorMessage: '',

        loading: false,
    }),
    computed: {
        fishSpecie(): string {
            return this.selectedFish?.key || ''
        },
        weightInGrams(): number {
            return parseInt(this.weightInGramsString) || 0
        },
        canSubmit(): boolean {
            return !!this.permitId && !!this.selectedFish && !!this.weightInGrams
        }
    },
    mounted() {

    },
    methods: {
        async submit(e: Event) {
            if (this.loading) return
            this.setLoading(true)
            e.preventDefault()

            // const isError = this.checkInputsForErrors()
            // if (isError) {
            //     this.setLoading(false)
            //     return
            // }

            await this.addCatchToPermit()
            this.setLoading(false)
        },

        async addCatchToPermit() {
            const { weightInGrams, permitId, fishSpecie } = this
            const updatedPermit = await fishingPermitApi.addCatchToPermit({ permitId, weightInGrams, specie: fishSpecie })

            if (updatedPermit) {
                this.closeModal()
                this.$emit("updatePermitData", updatedPermit)
            } else {
                this.setOverViewErrorMessage('Virhe lisättäessä saalista')
            }
        },


        closeModal(): void {
            this.$emit("closeModal")
        },

        selectFishSpecie(option: any): void {
            this.selectedFish = option
        },

        setErrorTextsDefault(): void {
            this.setErrorTextByKey('weightInGramsString', '')

            this.setOverViewErrorMessage('')
        },
        setOverViewErrorMessage(message: string): void {
            this.overViewErrorMessage = message
        },
        setErrorTextByKey(key: keyof ErrorTexts, text: string): void {
            this.errorTexts[key] = text
        },
        setLoading(value: boolean): void {
            this.loading = value
        }
    }

}
</script>

<style lang="less" scoped>
.component-AddCatchModal {
    .form-wrapper {
        padding: 16px;
        width: 350px;
        height: 400px;
        background: var(--black-1);
        border: 2px solid var(--black-2);
        border-radius: 10px;
        box-shadow: 0px 0px 30px 10px rgba(0, 0, 0, 0.5);

        h1 {
            text-align: center;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .error-wrapper {
                .error-message {
                    text-align: center;
                    color: var(--error-color);
                    margin: 0;
                }
            }

            .input-wrapper {
                display: flex;
                flex-direction: column;
                gap: 4px;
                position: relative;

                input,
                .single-select {
                    width: 350px;
                }
            }

            .button-wrapper {
                margin-top: 4px;
                width: 100%;
                display: flex;
                justify-content: flex-end;
            }
        }
    }
}
</style>