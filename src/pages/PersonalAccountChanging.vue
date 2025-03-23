<script setup lang="ts">

import {UserState} from "../utils/userState/UserState.ts";
import CustomInput from "../components/UI/inputs/CustomInput.vue";
import router from "../router/router.ts";
import Button from "../components/UI/CommonButton.vue";
import {UserResolver} from "../api/resolvers/user/user.resolver.ts";
import {usePopupStore} from "../store/popup.store.ts";

const updateProfile = async () => {
  const userResolver = new UserResolver()
  userResolver.updateUser({
    id: UserState.id,
    updatedData: {
      username: UserState.username,
      birth: UserState.birth,
      sex: UserState.sex
    }
  }).then(res => {
    if (res.status == 200) {
      router.push('/profile')
    } else {
      const popUpStore = usePopupStore()
      popUpStore.activateErrorPopup(res.body)
    }
  }).catch((err) => {
      const popUpStore = usePopupStore()
      popUpStore.activateErrorPopup(err.message)
  })

}
</script>

<template>
  <div class="container">
    <h1>Редактировать профиль</h1>
    <div class="fields">
      <div class="field username">
        <h3>Имя пользователя</h3>
        <div class="input-wrapper">
          <CustomInput type="text" v-model="UserState.username"/>
        </div>
      </div>
      <div class="field age">
        <h3>Дата Рождения</h3>
        <div class="input-wrapper">
          <CustomInput
              type="date"
              v-model="UserState.birth"
          />
        </div>
      </div>
      <div class="field sex">
        <h3>Пол</h3>
        <div class="radios">
          <input
              :checked="UserState.sex == 'MALE'"
              type="radio"
              name="sex"
              value="male"
              id="input-sex-male"
              v-model="UserState.sex"
          >
          <div class="radio-sex">
            <label for="input-sex-male">
              Мужской
            </label>
          </div>
          <input
              :checked="UserState.sex == 'FEMALE'"
              type="radio"
              name="sex"
              value="female"
              id="input-sex-female"
              v-model="UserState.sex"
          >
          <div class="radio-sex">
            <label for="input-sex-female">
              Женский
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <Button @click="router.push('/auth/changePassword')">
        <template v-slot:placeholder>Сменить пароль</template>
      </Button>
      <Button @click="updateProfile()" class="submit_button">
        <template v-slot:placeholder>Применить</template>
      </Button>
    </div>
  </div>
</template>

<style scoped>
  .container {
    background-color: var(--background-primary);
    height: 50vh;
    min-width: 40vw;
    border-radius: 15px;
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    gap: 1vw;
    padding: 3vw;
    margin-top: 10vh;
  }

  h1 {
    font-size: 3vh;
  }

  h3 {
    font-size: 2vh;
  }

  .fields {
    display: grid;
    grid-template-columns: max-content auto;
    gap: 2vw;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 1vw;
    background-color: var(--background-secondary);
    padding: 1vw;
    border-radius: 15px;
  }

  .field.username {
    grid-column: 1 / 3;
  }

  .field .input-wrapper {
    display: flex;
    height: 4vh;
  }

  .field.sex .radios {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 4vh;
    gap: 1vw;
  }

  .radio-sex {
    background-color: var(--background-secondary);
    width: 100%;
    border-radius: 10px;
    transition: all 0.3s;

    label {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding: 1vw;
      height: 4vh;
      font-size: 1.5vh;
      border-radius: 10px;
      transition: background-color 0.3s;
    }
    :hover {
      cursor: pointer;
      background-color: var(--submit-button-secondary);
      color: white;
    }
  }

  input[name="sex"]:checked + .radio-sex {
    background-color: var(--submit-button-primary);

    label {
      color: white
    }
  }

  input[name="sex"] {
    display: none;
  }

  .buttons {
    margin-top: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2vw;
  }

  .buttons > button {
    flex: 1;
    height: 4vh;
    font-size: 1.8vh;
  }
  
  @media (orientation: portrait) {
    .container {
      padding: 5vw;
      height: auto;
      margin-top: 0;
      gap: 4vw
    }
    .fields {
      grid-template-columns: auto;
    }

    .field {
      padding: 3vw;
      border-radius: 10px;
    }

    .field.username {
      grid-column: 1 / 2;
    }

    .buttons {
      grid-template-columns: auto;
    }
  }
</style>