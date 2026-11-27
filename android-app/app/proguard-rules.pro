# Loadly v2.0 ProGuard / R8 Keep Rules
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

# Model classes
-keep class com.cynorra.loadly.model.** { *; }

# Google Play Services / AdMob / UMP / Play Review
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.android.ump.** { *; }
-keep class com.google.android.play.core.** { *; }

# Firebase
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**
