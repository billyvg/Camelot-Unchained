/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-23 17:36:27
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-01-23 17:37:03
 */
import Respawn from '../../../components/Respawn';
import { LayoutMode, Edge } from '../../../components/HUDDrag';

export default {
  position: {
    x: {
      anchor: 5,
      offset: -100
    },
    y: {
      anchor: 3,
      offset: 0
    },
    size: {
      width: 200,
      height: 200
    },
    scale: 1,
    opacity: 1,
    visibility: false,
    zOrder: 9,
    layoutMode: LayoutMode.GRID
  },
  dragOptions: {},
  component: Respawn,
  props: {}
};
