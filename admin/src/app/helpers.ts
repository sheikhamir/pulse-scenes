import { Image, Page, Label, Icon, Fader, Meter, Button, Text, CSS } from "src/interfaces/Controller";

export class Helpers {
  static standardise(item: any): Image | Page | Label | Icon | Fader | Meter | Button | Text | CSS | null {
    return type[item.type](item);
  }
  static screen() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
}

const type: { [key: string]: (controller: any) => Image | Page | Label | Icon | Fader | Meter | Button | Text | CSS | null } = {
  image: function(item: Image) {
    return <Image>{
      id: item.id,
      type: item.type,
      pageId: item.pageId,
      css: item.css,
      cssClass: item.cssClass,
      active: item.active,
      width: item.width,
      height: item.height,
      top: item.top,
      left: item.left,
      // Image
      srcType: item.srcType,
      value: item.value
    }
  },
  page: function(item: Page) {
    return <Page>{
      id: item.id,
      type: item.type,
      pageId: item.pageId,
      css: item.css,
      cssClass: item.cssClass,
      active: item.active,
      width: item.width,
      height: item.height,
      top: item.top,
      left: item.left,
      // Page
      targetPage: item.targetPage,
      title: item.title
    }
  },
  label: function(item: Label) {
    return <Label>{
      id: item.id,
      type: item.type,
      pageId: item.pageId,
      css: item.css,
      cssClass: item.cssClass,
      active: item.active,
      width: item.width,
      height: item.height,
      top: item.top,
      left: item.left,
      // Flex
      flexDirection: item.flexDirection,
      flexWrap: item.flexWrap,
      alignContent: item.alignContent,
      justifyContent: item.justifyContent,
      alignItems: item.alignItems,
      // Label
      tag: item.tag,
      textAlign: item.textAlign,
      value: item.value
    }
  },
  icon: function(item: Icon) {
    return <Icon>{
      id: item.id,
      type: item.type,
      pageId: item.pageId,
      css: item.css,
      cssClass: item.cssClass,
      active: item.active,
      width: item.width,
      height: item.height,
      top: item.top,
      left: item.left,
      // Icon
      value: item.value
    }
  },
  fader: function(item: Fader) {
    return <Fader>{
      id: item.id,
      type: item.type,
      pageId: item.pageId,
      css: item.css,
      cssClass: item.cssClass,
      active: item.active,
      width: item.width,
      height: item.height,
      top: item.top,
      left: item.left,
      // Fader
      handle: item.handle,
      min: item.min,
      max: item.max,
      vertical: item.vertical,
      current_value: item.current_value
    }
  },
  meter: function(item: Meter) {
    return <Meter>{
      id: item.id,
      type: item.type,
      pageId: item.pageId,
      css: item.css,
      cssClass: item.cssClass,
      active: item.active,
      width: item.width,
      height: item.height,
      top: item.top,
      left: item.left,
      // Meter
      handle: item.handle,
      min: item.min,
      max: item.max,
      vertical: item.vertical,
      current_value: item.current_value
    }
  },
  button: function(item: Button) {
    return <Button>{
      id: item.id,
      type: item.type,
      pageId: item.pageId,
      css: item.css,
      cssClass: item.cssClass,
      active: item.active,
      width: item.width,
      height: item.height,
      top: item.top,
      left: item.left,
      // Button
      handle: item.handle,
      toggle: item.toggle,
      toggleValue: item.toggleValue,
      setValue: item.setValue,
      current_value: item.current_value,
      label: item.label
    }
  },
  text: function(item: Text) {
    return <Text>{
      id: item.id,
      type: item.type,
      pageId: item.pageId,
      css: item.css,
      cssClass: item.cssClass,
      active: item.active,
      width: item.width,
      height: item.height,
      top: item.top,
      left: item.left,
      // Text
      handle: item.handle,
      operation: item.operation,
      label: item.label,
      labelPosition: item.labelPosition
    }
  },
  css: function(item: CSS) {
    return <CSS>{
      pageId: item.pageId,
      css: item.css
    }
  }
}
