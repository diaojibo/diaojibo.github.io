---
title: 安卓实战学习记录01
date: 2016-03-20 23:28:52
tags: 
 - Android 
categories: Android
---

---

## 顶部导航和左右滑动抽屉

#### Toolbar

跟导航栏有关则有**Actionbar**和**Toolbar** 查阅资料可知，Toolbar是在API21后引进的，放在v7库当中，是应用的内容标准工具栏，而**Actionbar**一些方法已经标注过时了。相比于**Actionbar**，它变得更加自由。

使用Toolbar要先把主题样式里的Actionbar去掉，在manifest中

    android:theme="@style/Theme.AppCompat.Light.NoActionBar">


此外toolbar 是没有tab的，他需要结合support库里的tablayout来完成原来actionbar里的tab功能。除此之外，你在使用toolbar的时候要先屏蔽掉

定义好xml文件后，我们在java文件中引入toolbar这个类

``` java
private android.support.v7.widget.Toolbar toolbar;
```

这里注意要引用supportv7的包，否则会出错，Toolbar向下兼容，这样才可以接着调用**setSupportActionBar**


``` java
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    oolbar = (android.support.v7.widget.Toolbar) findViewById(R.id.mytoolbar);
    setSupportActionBar(toolbar);
    }

```

toolbar很灵活，因为它就是一个viewgroup。如果要显示navigationicon，也许最好的做法是把它在代码中进行set，因为xml中的设置可能要API21以上才能看见


#### DrawerLayout
官方在13年发布的一个布局，用以创建侧滑菜单。从此我们可以不需要使用github上的侧滑菜单项目了。要创建一个DrawerLayout，我们必须要把它定为根视图，这样再把主要视图作为第一个子节点放入


#### CoordinatorLayout

根据谷歌的官方文档
>CoordinatorLayout is a super-powered FrameLayout.

可以看到它真是super-powered
CoordinatorLayout一般用于顶层布局和协调子布局。
要使用它必须在Gradle把包引进来。

``` java
compile 'com.android.support:design:23.1.1' 
```
由于CoordinatorLayout基于FrameLayout，所以这里也提一下FrameLayout，并且再提一下待会用到的几个layout
##### FrameLayout

帧布局FrameLayout在Android的五大布局中是最简单的布局方式，在需要布局中的控件有重叠的情况下才使用。FrameLayout中的控件layout\_margin设置要依赖layout\_gravity属性，否则layout_margin设置无效。如果想要控件正常显示，可以将控件的layout\_gravity设置为top,以屏幕左上角为参考点。


##### AppBarLayout
>AppBarLayout is a vertical LinearLayout which implements many of the features of material designs app bar concept, namely scrolling gestures.

经常用来实现一线滑动效果并且经常和CoordinatorLayout配套使用

##### TabLayout
这也是谷歌推出的新控件，可以很方便的用来作标签导航。结合ViewPager一起使用能有很好的效果。

### 标签页的具体实现

标签页的主角毫无疑问就是TabLayout了。我们现在xml文件中定义TabLayout。


``` java
<android.support.design.widget.TabLayout
   android:id="@+id/tabs"
   android:layout_width="match_parent"
   ndroid:layout_height="wrap_content">

```

定义了之后就已经可以标签名之类的属性了。但是我们的目的是标签分页实现之后跳转到不同的Fragment。所以我们还得使用一个ViewPager跟TabLayout配套使用。要使得标签跳转，可以直接用**FragmentPagerAdapter** 跟TabLayout配套使用。这样这个Adapter就同时控制了TabLayout和ViewPager并使他们数据同步。
``` java
        <android.support.v4.view.ViewPager
            android:id="@+id/myviewpager"
            android:layout_width="match_parent"
            android:layout_height="match_parent">

        </android.support.v4.view.ViewPager>
```

接下来是代码部分了
``` java
        TabLayout mTabLayout = (TabLayout) findViewById(R.id.tabs);

        //取得一个自定义PagerAdapter的实例
        mAdapter = new TabPagerAdapter(getSupportFragmentManager());
        mViewPager = (ViewPager) findViewById(R.id.myviewpager);

        //讲ViewPager和Adapter绑定起来获得数据
        mViewPager.setAdapter(mAdapter);

        //一站式同步，将TabLayout和PagerAdapter绑定起来
        mTabLayout.setupWithViewPager(mViewPager);

```

PagerAdapter的定义可以去查看官方文档。需要实现两个方法。一个是**getItem**方法，用来根据position返回不同的Fragment。getCount方法用来返回标签的个数，而getPagerTitle方法可以获得页面对应的标签。代码把这些定义好就可以成功了。

### 抽屉效果的实现
首先得在xml定义一个 **DrawerLayout** ，然后第一个子节点是本体要显示的内容maincontent，然后之后放入一个**NavigationView**来做Menu。
``` java
<?xml version="1.0" encoding="utf-8"?>
<android.support.v4.widget.DrawerLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools" android:id="@+id/drawer_layout"
    android:layout_width="match_parent" android:layout_height="match_parent"
    android:fitsSystemWindows="true" tools:openDrawer="start">

    <include layout="@layout/activity_main" android:layout_width="match_parent"
        android:layout_height="match_parent" />

    <android.support.design.widget.NavigationView android:id="@+id/nav_view"
        android:layout_width="wrap_content" android:layout_height="match_parent"
        android:layout_gravity="start" android:fitsSystemWindows="true"
        app:menu="@menu/activity_main_drawer_drawer" />

</android.support.v4.widget.DrawerLayout>
```

定义一个drawerlayout布局文件，然后最后在Activity里面调用就可以了。


抽屉效果的实现也是不难的，我们只需要使用DrawerLayout这一个布局。首先我们定义一个drawer的xml文件，然后这里要注意，第一个放的子节点必须是你要放的主要界面，即是刚才的activity_main.xml。所以我们现在假定有以下的布局。

``` java
<?xml version="1.0" encoding="utf-8"?>
<android.support.v4.widget.DrawerLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools" android:id="@+id/drawer_layout"
    android:layout_width="match_parent" android:layout_height="match_parent"
    android:fitsSystemWindows="true" tools:openDrawer="start">

    <include layout="@layout/activity_main" android:layout_width="match_parent"
        android:layout_height="match_parent" />

    <android.support.design.widget.NavigationView android:id="@+id/nav_view"
        android:layout_width="wrap_content" android:layout_height="match_parent"
        android:layout_gravity="start" android:fitsSystemWindows="true"
        app:menu="@menu/activity_main_drawer_menu" />

</android.support.v4.widget.DrawerLayout>
```

这时我们要在res下开个menu文件夹，创建menu条目xml来创建对应的菜单。例如：

``` java
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android">

    <group android:checkableBehavior="single">
        <item
            android:id="@+id/animation"
            android:title="动画" />
        <item
            android:id="@+id/book"
            android:title="书籍" />
        <item
            android:id="@+id/music"
            android:title="音乐" />
        <item
            android:id="@+id/game"
            android:title="游戏" />
    </group>
</menu>
```

当然你也可以给每个条目添加icon，然后还要给NavigationView定制一个header，header也是个xml文件，这里就不给出header文件了。然后在代码中指定就形成一个初步的Drawer了。

``` java
mNavigationView = (NavigationView) findViewById(R.id.nav_view);
        View nav_header = mNavigationView.inflateHeaderView(R.layout.nav_header);
```


