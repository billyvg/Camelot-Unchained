/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {client, events, Race, Faction, Gender, hasClientAPI, Player} from 'camelot-unchained';
import {PlayerStatus, BodyParts} from '../../../../lib/PlayerStatus';

import {fakePlayer, fakeHealthEvents, HealthAction, staminaUpdated, healthUpdated, playerUpdate, nameChanged, raceChanged, healtEmulationTest, avatarChanged} from '../../../../lib/reduxHealth';
import {merge, clone, defaultAction} from '../../../../lib/reduxUtils';
const DO_THING = 'testthing';

const INIT = 'playerhealth/player/INIT';
const STAMINA_UPDATED = 'playerhealth/player/STAMINA_UPDATED';
const HEALTH_UPDATED = 'playerhealth/player/HEALTH_UPDATED';

const RACE_CHANGED = 'playerhealth/player/RACE_CHANGED';
const NAME_CHANGED = 'playerhealth/player/NAME_CHANGED';
const FACTION_CHANGED = 'playerhealth/player/FACTION_CHANGED';
const AVATAR_CHANGED = 'playerhealth/player/AVATAR_CHANGED';
const PLAYER_UPDATE = 'playerhealth/player/PLAYER_UPDATE';

const characterImages = {
  humanM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_pict-m.png',
  humanF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_pict-f.png',
  luchorpanM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_luchorpan-m.png',
  luchorpanF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_luchorpan-f.png',
  valkyrieM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_valkyrie-m.png',
  valkyrieF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_valkyrie-m.png',
  humanmalevM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_valkyrie-m.png',
  humanmaleaM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-m-art.png',
  humanmaletM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-m-tdd.png',
  humanmalevF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-f-vik.png',
  humanmaleaF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-f-art.png',
  humanmaletF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-f-tdd.png'
};

function getAvatar(gender: Gender, race: Race) {
  if (gender === 1) { // MALE
    switch (race) {
      case 2: return characterImages.luchorpanM; // Luchorpan
      case 4: return characterImages.valkyrieM; // Valkyrie
      case 15: return characterImages.humanmalevM; // Humanmalev
      case 16: return characterImages.humanmaleaM; // Humanmalea
      case 17: return characterImages.humanmaletM; // Humanmalet
      case 18: return characterImages.humanM; // Pict
    }
  } else {
    switch (race) {
      case 2: return characterImages.luchorpanF; // Luchorpan
      case 4: return characterImages.valkyrieF; // Valkyrie
      case 15: return characterImages.humanmalevF; // Humanmalev
      case 16: return characterImages.humanmaleaF; // Humanmalea
      case 17: return characterImages.humanmaletF; // Humanmalet
      case 18: return characterImages.humanF; // Pict
    }
  }
}

export interface PlayerAction extends HealthAction {
}

function init(): PlayerAction {
  return {
    type: INIT,
    when: new Date()
  };
}

function onStaminaChanged(current: number, max: number): PlayerAction {
  return {
    type: STAMINA_UPDATED,
    when: new Date(),
    current: current,
    max: max,
  };
}

function onHealthChanged(current: number, max: number, part: BodyParts): PlayerAction {
  return {
    type: HEALTH_UPDATED,
    when: new Date(),
    current: current,
    max: max,
    part: part,
  };
}

function onNameChanged(name: string): PlayerAction {
  return {
    type: NAME_CHANGED,
    when: new Date(),
    text: name,
  };
}


function onRaceChanged(race: Race): PlayerAction {
  return {
    type: RACE_CHANGED,
    when: new Date(),
    race: race,
  };
}

function onFactionChanged(faction: Faction): PlayerAction {
  return {
    type: FACTION_CHANGED,
    when: new Date(),
    faction: faction,
  };
}

function onCharacterUpdate(player: Player): PlayerAction {
  return {
    type: PLAYER_UPDATE,
    when: new Date(),
    player: player,
  }
}

function onAvatarChanged(avatar: string): PlayerAction {
  return {
    type: AVATAR_CHANGED,
    when: new Date(),
    avatar: avatar
  }
}

export function DoThing(): PlayerAction {
  return {
    type: DO_THING,
    when: new Date()
  }
}

export function initializePlayerSession() {
  return (dispatch: (action: any) => any) => {
    dispatch(init());

    // init handlers / events
    client.OnCharacterStaminaChanged((current: number, max: number) => dispatch(onStaminaChanged(current, max)));
    client.OnCharacterHealthChanged((current: number, max: number) => dispatch(onHealthChanged(current, max, BodyParts.Torso)));
    client.OnCharacterInjuriesChanged((part: number, health: number, maxHealth: number) => dispatch(onHealthChanged(health, maxHealth, part)));
    client.OnCharacterNameChanged((name: string) => dispatch(onNameChanged(name)));

    client.OnCharacterFactionChanged((faction: Faction) => dispatch(onFactionChanged(faction)));
    client.OnCharacterRaceChanged((race: Race) => {
      dispatch(onRaceChanged(race));
      client.OnCharacterGenderChanged((gender: Gender) => dispatch(onAvatarChanged(getAvatar(gender, race))))
    });

    events.on(events.clientEventTopics.handlesCharacter, (player: Player) => dispatch(onCharacterUpdate(player)));

  };
}

export interface PlayerState {
  playerStatus: PlayerStatus;
  events: {
    key: number,
    value: string,
    textType: string,
    iconType: string,
    timestamp: number,
  }[];
}

function initialState() {
  return {
    playerStatus: fakePlayer(),
    events: hasClientAPI() ? [] : fakeHealthEvents(),
  };
}

export default function reducer(state: PlayerState = initialState(), action: PlayerAction = defaultAction) : PlayerState {
  switch(action.type) {
    case INIT: return merge(state, {});

    case STAMINA_UPDATED:
    {
      return merge(state, staminaUpdated(state.playerStatus, action));
    }

    case HEALTH_UPDATED:
    {
      return merge(state, healthUpdated(state.playerStatus, action));
    }

    case NAME_CHANGED:
    {
      return merge(state, nameChanged(state.playerStatus, action));
    }

    case RACE_CHANGED:
    {
      return merge(state, raceChanged(state.playerStatus, action));
    }

    case PLAYER_UPDATE:
    {
      return merge(state, playerUpdate(state.playerStatus, state.events, action));
    }

    case AVATAR_CHANGED:
    {
      return merge(state, avatarChanged(state.playerStatus, action));
    }

    case DO_THING:
    {
      return merge(state, healtEmulationTest(state.playerStatus, state.events, action));
    }

    default: return state;
  }
}
