package com.chrome_controller_tv

import android.view.KeyEvent
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "chrome_controller_tv"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun dispatchKeyEvent(event: KeyEvent): Boolean {
    val key = when (event.keyCode) {
        KeyEvent.KEYCODE_MEDIA_REWIND -> "rewind"
        KeyEvent.KEYCODE_MEDIA_FAST_FORWARD -> "forward"
        else -> null
    }
    if (key != null) {
        reactHost?.currentReactContext
            ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            ?.emit("onMediaKey", Arguments.createMap().apply {
                putString("key", key)
                putString("action", if (event.action == KeyEvent.ACTION_DOWN) "down" else "up")
                putInt("repeat", event.repeatCount)
            })
        return true // consommé : ni dev menu, ni useTVEventHandler
    }
    return super.dispatchKeyEvent(event)
  }
}
